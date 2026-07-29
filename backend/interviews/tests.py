from datetime import timedelta
from django.utils import timezone
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import InterviewSession, Question, Answer, Feedback

User = get_user_model()


class StreakAndXPTests(TestCase):
    """
    Covers CompleteInterviewView's streak/XP block:
      - same-day completion -> streak unchanged
      - completion exactly 1 day after last_activity -> streak += 1
      - any bigger gap (or no prior activity) -> streak resets to 1
      - xp_points += int(total_score * 10)
    """

    def setUp(self):
        self.user = User.objects.create_user(email='a@a.com', username='a', password='pass12345')
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def _complete_session(self, score=8.0):
        session = InterviewSession.objects.create(
            user=self.user, role='backend', difficulty='beginner', company='local', status='active'
        )
        q = Question.objects.create(session=session, text='Q', order=1)
        a = Answer.objects.create(question=q, text='A')
        Feedback.objects.create(answer=a, score=score, correct_answer='ideal')
        return self.client.post(f'/api/interviews/{session.id}/complete/')

    def test_first_completion_sets_streak_to_1(self):
        res = self._complete_session()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.streak_days, 1)

    def test_consecutive_day_increments_streak(self):
        self.user.streak_days = 3
        self.user.last_activity = timezone.now().date() - timedelta(days=1)
        self.user.save()
        self._complete_session()
        self.user.refresh_from_db()
        self.assertEqual(self.user.streak_days, 4)

    def test_gap_day_resets_streak(self):
        self.user.streak_days = 5
        self.user.last_activity = timezone.now().date() - timedelta(days=3)
        self.user.save()
        self._complete_session()
        self.user.refresh_from_db()
        self.assertEqual(self.user.streak_days, 1)

    def test_same_day_completion_does_not_change_streak(self):
        self.user.streak_days = 2
        self.user.last_activity = timezone.now().date()
        self.user.save()
        self._complete_session()
        self.user.refresh_from_db()
        # completing twice in one day shouldn't inflate the streak
        self.assertEqual(self.user.streak_days, 2)

    def test_xp_awarded_based_on_score(self):
        self._complete_session(score=7.0)
        self.user.refresh_from_db()
        self.assertEqual(self.user.xp_points, 70)

    def test_xp_accumulates_across_sessions(self):
        self._complete_session(score=5.0)
        self._complete_session(score=6.0)
        self.user.refresh_from_db()
        self.assertEqual(self.user.xp_points, 110)

    def test_complete_session_with_no_answers_does_not_crash(self):
        # total_score stays None when there's no Feedback, xp should add 0
        session = InterviewSession.objects.create(
            user=self.user, role='backend', difficulty='beginner', company='local', status='active'
        )
        res = self.client.post(f'/api/interviews/{session.id}/complete/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        session.refresh_from_db()
        self.user.refresh_from_db()
        self.assertIsNone(session.total_score)
        self.assertEqual(self.user.xp_points, 0)

    def test_cannot_complete_another_users_session(self):
        other = User.objects.create_user(email='b@b.com', username='b', password='pass12345')
        session = InterviewSession.objects.create(
            user=other, role='backend', difficulty='beginner', company='local', status='active'
        )
        res = self.client.post(f'/api/interviews/{session.id}/complete/')
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)


class SubmitAnswerTests(TestCase):
    """Covers SubmitAnswerView, mocking the Groq call so no network/API key is needed."""

    def setUp(self):
        self.user = User.objects.create_user(email='a@a.com', username='a', password='pass12345')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.session = InterviewSession.objects.create(
            user=self.user, role='backend', difficulty='beginner', company='local', status='active'
        )
        self.question = Question.objects.create(session=self.session, text='Explain REST', order=1)

    def test_submit_answer_creates_feedback(self):
        from unittest.mock import patch

        fake_eval = {
            'score': 8.5,
            'problems': [],
            'correct_answer': 'A good REST answer.',
            'tips': ['Read more about HTTP verbs'],
        }
        with patch('interviews.views.evaluate_answer', return_value=fake_eval):
            res = self.client.post(
                f'/api/interviews/{self.session.id}/answer/',
                {'question_id': self.question.id, 'answer_text': 'REST is stateless...'},
            )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.question.refresh_from_db()
        self.assertTrue(Feedback.objects.filter(answer__question=self.question).exists())
        self.assertEqual(Feedback.objects.get(answer__question=self.question).score, 8.5)

    def test_submit_answer_handles_ai_service_failure(self):
        from unittest.mock import patch

        with patch('interviews.views.evaluate_answer', side_effect=Exception('groq down')):
            res = self.client.post(
                f'/api/interviews/{self.session.id}/answer/',
                {'question_id': self.question.id, 'answer_text': 'REST is stateless...'},
            )
        self.assertEqual(res.status_code, status.HTTP_502_BAD_GATEWAY)