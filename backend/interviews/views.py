from datetime import timedelta
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import InterviewSession, Question, Answer, Feedback
from .serializers import (
    InterviewSessionSerializer,
    StartInterviewSerializer,
    SubmitAnswerSerializer,
    QuestionSerializer,
)
from .ai_service import generate_questions, evaluate_answer


class StartInterviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = StartInterviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        role = serializer.validated_data['role']
        difficulty = serializer.validated_data['difficulty']
        company = serializer.validated_data['company']

        skills = getattr(request.user, 'skills', None) or []

        session = InterviewSession.objects.create(
            user=request.user,
            role=role,
            difficulty=difficulty,
            company=company,
            status='active',
        )

        try:
            questions_data = generate_questions(role, difficulty, company, skills)
        except Exception as e:
            session.delete()
            return Response(
                {'detail': f'Failed to generate questions: {str(e)}'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        questions = []
        for i, q in enumerate(questions_data):
            questions.append(Question(
                session=session,
                text=q.get('text', ''),
                topic=q.get('topic', ''),
                question_type=q.get('type', 'technical'),
                order=i + 1,
            ))
        Question.objects.bulk_create(questions)

        return Response(
            InterviewSessionSerializer(session).data,
            status=status.HTTP_201_CREATED,
        )


class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        session = get_object_or_404(
            InterviewSession, id=session_id, user=request.user
        )

        serializer = SubmitAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question_id = serializer.validated_data['question_id']
        answer_text = serializer.validated_data['answer_text']

        question = get_object_or_404(Question, id=question_id, session=session)

        answer, _ = Answer.objects.update_or_create(
            question=question,
            defaults={'text': answer_text},
        )

        try:
            eval_data = evaluate_answer(
                question.text, answer_text, session.role, session.difficulty
            )
        except Exception as e:
            return Response(
                {'detail': f'Failed to evaluate answer: {str(e)}'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        Feedback.objects.update_or_create(
            answer=answer,
            defaults={
                'score': eval_data.get('score', 0),
                'problems': eval_data.get('problems', []),
                'correct_answer': eval_data.get('correct_answer', ''),
                'tips': eval_data.get('tips', []),
            },
        )

        question.refresh_from_db()
        return Response(QuestionSerializer(question).data, status=status.HTTP_200_OK)


class CompleteInterviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        session = get_object_or_404(
            InterviewSession, id=session_id, user=request.user
        )

        scores = Feedback.objects.filter(
            answer__question__session=session
        ).values_list('score', flat=True)

        if scores:
            session.total_score = sum(scores) / len(scores)

        session.status = 'completed'
        session.completed_at = timezone.now()
        session.save()

        # --- streak + XP update ---
        user = request.user
        today = timezone.now().date()
        if user.last_activity == today:
            pass  # already counted today
        elif user.last_activity == today - timedelta(days=1):
            user.streak_days += 1
        else:
            user.streak_days = 1
        user.last_activity = today
        user.xp_points += int((session.total_score or 0) * 10)
        user.save()
        # --------------------------

        return Response(
            InterviewSessionSerializer(session).data, status=status.HTTP_200_OK
        )


class InterviewHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = InterviewSession.objects.filter(
            user=request.user
        ).order_by('-created_at')
        return Response(InterviewSessionSerializer(sessions, many=True).data)


class InterviewDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        session = get_object_or_404(
            InterviewSession, id=session_id, user=request.user
        )
        return Response(InterviewSessionSerializer(session).data)