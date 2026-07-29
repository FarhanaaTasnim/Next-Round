from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_creates_user_and_returns_tokens(self):
        res = self.client.post('/api/users/register/', {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'strongpass123',
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', res.data['tokens'])
        self.assertTrue(User.objects.filter(email='test@example.com').exists())

    def test_register_rejects_short_password(self):
        # RegisterSerializer enforces min_length=8 on password
        res = self.client.post('/api/users/register/', {
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'short',
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_rejects_duplicate_email(self):
        User.objects.create_user(email='dupe@example.com', username='dupe1', password='pass12345')
        res = self.client.post('/api/users/register/', {
            'email': 'dupe@example.com',
            'username': 'dupe2',
            'password': 'pass12345',
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_correct_credentials_returns_tokens(self):
        User.objects.create_user(email='a@a.com', username='a', password='rightpass123')
        res = self.client.post('/api/users/login/', {'email': 'a@a.com', 'password': 'rightpass123'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data['tokens'])

    def test_login_with_wrong_password_fails(self):
        User.objects.create_user(email='a@a.com', username='a', password='rightpass123')
        res = self.client.post('/api/users/login/', {'email': 'a@a.com', 'password': 'wrongpass'})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_with_nonexistent_email_fails(self):
        res = self.client.post('/api/users/login/', {'email': 'ghost@example.com', 'password': 'whatever123'})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_requires_authentication(self):
        res = self.client.get('/api/users/profile/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_returns_authenticated_users_data(self):
        user = User.objects.create_user(email='a@a.com', username='a', password='pass12345')
        self.client.force_authenticate(user)
        res = self.client.get('/api/users/profile/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['email'], 'a@a.com')