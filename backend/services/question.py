from schema.answer import CreateAnswer
from schema.question import CreateQuestion
from src.db import db
from uuid import uuid4
from datetime import datetime


async def add_question(question: CreateQuestion, user_id: str):
    question = question.to_json()
    new_question = await db.question.create({"id": str(uuid4()), "author_id": user_id, **question, "created_at": datetime.now(), "updated_at": datetime.now()})
    return new_question


async def add_answer_question(answer: CreateAnswer, question_id: str, user_id: str):
    """"""
    answer = answer.to_json()
    new_answer = await db.answer.create({
        "id": str(uuid4()),
        "author_id": user_id,
        **answer,
        "question_id": question_id,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    })
    return new_answer.model_dump()
