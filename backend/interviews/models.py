from django.db import models
from django.conf import settings


class InterviewSession(models.Model):
    ROLE_CHOICES = [
        ('backend', 'Backend Developer'),
        ('frontend', 'Frontend Developer'),
        ('django', 'Django Developer'),
        ('sqa', 'SQA Engineer'),
        ('data', 'Data Scientist'),
        ('software', 'Software Engineer'),
    ]
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    COMPANY_CHOICES = [
        ('google', 'Google'),
        ('microsoft', 'Microsoft'),
        ('amazon', 'Amazon'),
        ('netflix', 'Netflix'),
        ('openai', 'OpenAI'),
        ('local', 'Local Company'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sessions')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    company = models.CharField(max_length=20, choices=COMPANY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.role} - {self.difficulty}"


class Question(models.Model):
    TYPE_CHOICES = [
        ('technical', 'Technical'),
        ('behavioral', 'Behavioral'),
        ('coding', 'Coding'),
        ('hr', 'HR'),
    ]

    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    topic = models.CharField(max_length=100, blank=True)
    question_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='technical')
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Q{self.order}: {self.text[:60]}"


class Answer(models.Model):
    question = models.OneToOneField(Question, on_delete=models.CASCADE, related_name='answer')
    text = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer to Q{self.question.order}"


class Feedback(models.Model):
    answer = models.OneToOneField(Answer, on_delete=models.CASCADE, related_name='feedback')
    score = models.FloatField()
    problems = models.JSONField(default=list)
    correct_answer = models.TextField()
    tips = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback - Score: {self.score}/10"