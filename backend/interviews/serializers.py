from rest_framework import serializers
from .models import InterviewSession, Question, Answer, Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['score', 'problems', 'correct_answer', 'tips']


class AnswerSerializer(serializers.ModelSerializer):
    feedback = FeedbackSerializer(read_only=True)

    class Meta:
        model = Answer
        fields = ['id', 'text', 'submitted_at', 'feedback']


class QuestionSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer(read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'topic', 'question_type', 'order', 'answer']


class InterviewSessionSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = InterviewSession
        fields = [
            'id', 'role', 'difficulty', 'company', 'status',
            'total_score', 'created_at', 'completed_at',
            'questions', 'question_count'
        ]

    def get_question_count(self, obj):
        return obj.questions.count()


class StartInterviewSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=[
        'backend', 'frontend', 'django', 'sqa', 'data', 'software'
    ])
    difficulty = serializers.ChoiceField(choices=[
        'beginner', 'intermediate', 'advanced'
    ])
    company = serializers.ChoiceField(choices=[
        'google', 'microsoft', 'amazon', 'netflix', 'openai', 'local'
    ])


class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer_text = serializers.CharField()