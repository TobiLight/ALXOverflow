from schema.answer import CreateAnswer, ReplyAnswer
from schema.question import CreateQuestion
from src.db import db
from uuid import uuid4
from datetime import datetime


async def create_answer_thread(reply_answer: ReplyAnswer, question_id: str, answer_id: str, user_id: str):
    """"""
    reply_answer = reply_answer.to_json()
    new_answer = await db.answerthread.create({
		"id": str(uuid4()),
		**reply_answer,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
	})
    existing = await db.answer.update(where={"id": answer_id}, data={
        "answer_thread": new_answer,
        "updated_at": datetime.now(),
        "question_id": question_id,
        # ""
    })
    
    return new_answer.model_dump()
