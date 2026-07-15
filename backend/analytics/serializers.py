from rest_framework import serializers
from interviews.models import InterviewSession


class RecentSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewSession
        fields = ['id', 'role', 'company', 'difficulty', 'status', 'total_score', 'created_at', 'completed_at']


class DashboardStatsSerializer(serializers.Serializer):
    streak_days = serializers.IntegerField()
    xp_points = serializers.IntegerField()
    total_interviews = serializers.IntegerField()
    completed_interviews = serializers.IntegerField()
    average_score = serializers.FloatField()
    recent_sessions = RecentSessionSerializer(many=True)