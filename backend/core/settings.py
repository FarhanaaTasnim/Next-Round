import os

DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = ['*']  # tighten this after deployment

CORS_ALLOWED_ORIGINS = [
    "https://your-nextround.vercel.app",  # replace with your actual Vercel URL
]