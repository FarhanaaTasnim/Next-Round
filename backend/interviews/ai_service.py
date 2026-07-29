import json
import logging
from groq import Groq
from django.conf import settings

logger = logging.getLogger(__name__)

_client = None


def _get_client():
    global _client
    if _client is None:
        if not settings.GROQ_API_KEY:
            raise RuntimeError("GROQ_API_KEY is not set in the environment")
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


def _parse_json_response(raw: str):
    """Strip markdown fences (if present) and parse the JSON payload."""
    raw = raw.strip()
    if raw.startswith('```'):
        raw = raw.split('```')[1]
        if raw.startswith('json'):
            raw = raw[4:]
    return json.loads(raw.strip())


def _call_with_retry(client, prompt, max_tokens, temperature, retries=1):
    """
    Call the Groq chat completion endpoint and parse the JSON response.
    If parsing fails (truncated output, stray commentary, bad escaping),
    retry with a stricter follow-up instruction appended to the prompt.
    """
    last_error = None
    current_prompt = prompt

    for attempt in range(retries + 1):
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": current_prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
        )
        raw = response.choices[0].message.content

        try:
            return _parse_json_response(raw)
        except (json.JSONDecodeError, IndexError) as e:
            last_error = e
            logger.warning(
                f"AI response parse failed on attempt {attempt + 1}/{retries + 1}: {e}"
            )
            current_prompt = (
                prompt
                + "\n\nIMPORTANT: Your previous response was not valid JSON. "
                  "Return ONLY the JSON object/array, nothing else — no commentary, "
                  "no markdown fences, no explanation."
            )

    raise RuntimeError(
        f"AI returned unparseable output after {retries + 1} attempts: {last_error}"
    )


def generate_questions(role, difficulty, company, skills):
    client = _get_client()
    skills_str = ', '.join(skills) if skills else 'general programming'

    company_context = {
        'google': 'Focus on algorithms, system design, scalability, and clean code.',
        'microsoft': 'Focus on problem solving, OOP, system design, and Azure concepts.',
        'amazon': 'Focus on leadership principles, scalable systems, and behavioral questions.',
        'netflix': 'Focus on system design, API design, microservices, and culture fit.',
        'openai': 'Focus on ML concepts, Python, system design, and research thinking.',
        'local': 'Focus on practical skills, REST APIs, databases, and project experience.',
    }.get(company, 'Focus on practical, well-rounded software engineering skills.')

    prompt = f"""You are a senior technical interviewer at {company}.

Candidate profile:
- Role: {role}
- Difficulty: {difficulty}
- Skills from resume: {skills_str}

Company focus: {company_context}

Generate exactly 8 interview questions tailored to this candidate.
Mix of question types: technical, behavioral, and coding.

Return ONLY a valid JSON array, no extra text, no markdown:
[
  {{
    "text": "question here",
    "topic": "topic name",
    "type": "technical"
  }}
]

Types must be one of: technical, behavioral, coding, hr"""

    return _call_with_retry(client, prompt, max_tokens=1500, temperature=0.7)


def evaluate_answer(question_text, user_answer, role, difficulty):
    client = _get_client()

    prompt = f"""You are a strict but fair technical interviewer evaluating a candidate's answer.

Role: {role}
Difficulty: {difficulty}

Question: {question_text}

Candidate's answer: {user_answer}

Evaluate this answer and return ONLY a valid JSON object, no extra text, no markdown:
{{
  "score": 7.5,
  "problems": [
    "Missing explanation of X",
    "Incorrect statement about Y"
  ],
  "correct_answer": "A complete ideal answer here...",
  "tips": [
    "Study X concept",
    "Practice Y"
  ]
}}

Score must be a number from 0 to 10.
Problems is a list of specific issues (empty list if answer is good).
correct_answer is a complete model answer.
Tips are study recommendations based on weak points."""

    return _call_with_retry(client, prompt, max_tokens=1000, temperature=0.3)