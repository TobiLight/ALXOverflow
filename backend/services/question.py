from models.question import CreateQuestion
from models.user import UserDetails, UserProfile, UserSignUp
from src.db import db
from uuid import uuid4
from datetime import datetime
from src.utils import hash_password


async def add_question(question: CreateQuestion, user_id: str):
    question = question.to_json()
    new_question = await db.question.create({"id": str(uuid4()), "author_id": user_id, **question, "created_at": datetime.now(), "updated_at": datetime.now()})
    return new_question