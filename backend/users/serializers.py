from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'preferred_role', 'target_company']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            preferred_role=validated_data.get('preferred_role', ''),
            target_company=validated_data.get('target_company', ''),
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'preferred_role',
            'target_company', 'skills', 'experience_years',
            'github', 'linkedin', 'resume', 'is_email_verified',
            'streak_days', 'xp_points'
        ]
        read_only_fields = ['email', 'is_email_verified', 'streak_days', 'xp_points']