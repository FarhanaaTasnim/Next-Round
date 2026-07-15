from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from interviews.models import InterviewSession
from .serializers import DashboardStatsSerializer


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        sessions = InterviewSession.objects.filter(user=user)
        completed = sessions.filter(status='completed')
        avg_score = completed.aggregate(avg=Avg('total_score'))['avg'] or 0

        data = {
            'streak_days': user.streak_days,
            'xp_points': user.xp_points,
            'total_interviews': sessions.count(),
            'completed_interviews': completed.count(),
            'average_score': round(avg_score, 1),
            'recent_sessions': sessions.order_by('-created_at')[:5],
        }
        return Response(DashboardStatsSerializer(data).data)