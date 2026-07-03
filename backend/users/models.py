from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('backend', 'Backend Developer'),
        ('frontend', 'Frontend Developer'),
        ('django', 'Django Developer'),
        ('sqa', 'SQA Engineer'),
        ('data', 'Data Scientist'),
        ('software', 'Software Engineer'),
    ]

    email = models.EmailField(unique=True)
    preferred_role = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True)
    target_company = models.CharField(max_length=100, blank=True)
    skills = models.JSONField(default=list)
    experience_years = models.PositiveIntegerField(default=0)
    github = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    is_email_verified = models.BooleanField(default=False)
    streak_days = models.PositiveIntegerField(default=0)
    last_activity = models.DateField(null=True, blank=True)
    xp_points = models.PositiveIntegerField(default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email