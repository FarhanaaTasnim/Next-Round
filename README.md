# NextRound

**AI-powered mock interview platform that helps developers practice, get instant feedback, and track their interview readiness.**

NextRound generates role-specific interview questions using LLM-powered AI, evaluates your answers in real time, and tracks your progress across sessions — built as a full-stack portfolio project demonstrating production-style architecture, authentication, and API design.

🔗 **Live Demo:** [next-round-tau.vercel.app](https://next-round-tau.vercel.app)
📦 **Repository:** [github.com/FarhanaaTasnim/Next-Round](https://github.com/FarhanaaTasnim/Next-Round)

---
Screenshots
<img width="557" height="428" alt="Screenshot 2026-07-11 205744" src="https://github.com/user-attachments/assets/d1fa5995-96da-4e62-9c2d-4f633a72df08" />
<img width="955" height="365" alt="Screenshot 2026-07-11 210508" src="https://github.com/user-attachments/assets/755dc2cf-107f-4205-965f-ca04d333a3be" />
<img width="614" height="434" alt="Screenshot 2026-07-11 211256" src="https://github.com/user-attachments/assets/ca96609d-5b85-4843-aba8-19ab371231e3" />
<img width="608" height="386" alt="Screenshot 2026-07-11 211356" src="https://github.com/user-attachments/assets/42f1fa64-67e7-4bcf-9048-410b9e1f6e86" />

## Features

- **AI-generated interview questions** tailored to a chosen role (Backend, Frontend, Django, SQA, Data Science, Software Engineering) via the Groq API (`llama-3.3-70b-versatile`)
- **Real-time answer evaluation** with structured, actionable feedback
- **Full interview session flow** — start an interview, answer questions, complete the session, and review results
- **Interview history & analytics** — track past sessions and monitor progress over time
- **Secure authentication** using JWT (access + refresh tokens) with a custom email-based user model
- **Gamification elements** — XP points and activity streaks to encourage consistent practice
- **Responsive UI** built with a modern React/Tailwind stack

---

## Tech Stack

**Backend**
- Django 6 + Django REST Framework
- SimpleJWT for token-based authentication
- Groq API for LLM-powered question generation & answer evaluation
- SQLite (deployment) 

**Frontend**
- React + Vite
- Tailwind CSS
- Zustand for state management
- Axios for API communication

**Deployment**
- Backend hosted on **Render**
- Frontend hosted on **Vercel**

---

## Project Structure

This is a monorepo with independently deployable frontend and backend services:

```
Next-Round/
├── backend/
│   ├── core/           # Django project settings, URLs, WSGI config
│   ├── users/          # Custom user model, auth (register/login/JWT)
│   ├── interviews/     # Interview session logic, question/answer flow
│   ├── analytics/      # Progress tracking & session history
│   ├── requirements.txt
│   └── manage.py
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```

---

## API Overview

| Endpoint | Description |
|---|---|
| `POST /api/users/register/` | Create a new account |
| `POST /api/users/login/` | Authenticate and receive JWT tokens |
| `POST /api/interviews/start/` | Start a new mock interview session |
| `POST /api/interviews/submit-answer/` | Submit an answer for evaluation |
| `POST /api/interviews/complete/` | Complete the current interview session |
| `GET /api/interviews/history/` | Retrieve past interview sessions |
| `GET /api/interviews/<id>/` | Retrieve details for a specific session |

---

## Getting Started Locally

### Prerequisites
- Python 3.12
- Node.js 18+
- A [Groq API key](https://console.groq.com)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create a .env file with:
# SECRET_KEY=your-secret-key
# GROQ_API_KEY=your-groq-api-key
# DEBUG=True

python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install

# Create a .env file with:
# VITE_API_URL=http://localhost:8000

npm run dev
```

---

## Roadmap

- [ ] Persistent database (PostgreSQL) for production data durability
- [ ] Resume-based question personalization
- [ ] Video/audio mock interview mode
- [ ] Company-specific interview question banks

---

## Author

**Farhana Tasnim**
📧 farhana.tasnim.993@gmail.com
🌐 [Portfolio](https://farhanatasnim.netlify.app)

---

## License

This project is available for educational and portfolio review purposes.
