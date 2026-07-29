from unittest.mock import patch
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import InterviewSession, Question

User = get_user_model()


class StartInterviewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='a@a.com', username='a', password='pass12345')
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.valid_body = {'role': 'backend', 'difficulty': 'beginner', 'company': 'local'}

    def test_start_interview_creates_session_and_questions(self):
        fake_questions = [
            {'text': 'What is REST?', 'topic': 'APIs', 'type': 'technical'},
            {'text': 'Tell me about a challenge you faced', 'topic': '', 'type': 'behavioral'},
        ]
        with patch('interviews.views.generate_questions', return_value=fake_questions):
            res = self.client.post('/api/interviews/start/', self.valid_body)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        session = InterviewSession.objects.get(id=res.data['id'])
        self.assertEqual(session.questions.count(), 2)
        self.assertEqual(res.data['question_count'], 2)
        self.assertEqual(len(res.data['questions']), 2)

    def test_start_interview_defaults_missing_topic_and_type(self):
        fake_questions = [{'text': 'What is REST?'}]  # no topic, no type
        with patch('interviews.views.generate_questions', return_value=fake_questions):
            res = self.client.post('/api/interviews/start/', self.valid_body)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        session = InterviewSession.objects.get(id=res.data['id'])
        question = session.questions.first()
        self.assertEqual(question.text, 'What is REST?')
        self.assertEqual(question.topic, '')
        self.assertEqual(question.question_type, 'technical')

    def test_start_interview_deletes_session_when_ai_service_fails(self):
        with patch('interviews.views.generate_questions', side_effect=Exception('groq down')):
            res = self.client.post('/api/interviews/start/', self.valid_body)

        self.assertEqual(res.status_code, status.HTTP_502_BAD_GATEWAY)
        self.assertFalse(InterviewSession.objects.filter(user=self.user).exists())

    def test_start_interview_requires_authentication(self):
        unauth_client = APIClient()  # no force_authenticate
        res = unauth_client.post('/api/interviews/start/', self.valid_body)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)