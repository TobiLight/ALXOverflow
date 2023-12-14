from typing import List, Union
from typing_extensions import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, responses
from starlette import status
from schema.answer import CreateAnswer, ReplyAnswer

from schema.question import CreateQuestion, FetchQuestions, Question
from schema.user import UserProfile
from services.answer import create_answer_thread
from services.question import add_answer_question, add_question
from src.deps import get_current_user
from src.utils import decode_token
from src.db import db
from prisma import errors
from uuid import uuid4

router = APIRouter(prefix="/api", tags=["Answer"], responses={404:
                                                              {"description": "Not found"}},)


@router.post("/question/{question_id}/answer/{answer_id}/reply",
             summary="Reply an answer", response_model_exclude_none=True)
async def reply_answer(reply_answer: ReplyAnswer, question_id: str,
                       answer_id: str,
                       user: Annotated[UserProfile, Depends(get_current_user)]):
    """"""
    print(reply_answer)
    question = await db.question.find_unique(where={'id': question_id})
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found!")
    answer = await db.answer.find_unique(where={"id": answer_id})
    if not answer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Answer not found!")
    
    try:
        reply_answer = await create_answer_thread(reply_answer, question_id, answer_id, user.get("id"))
    except errors.PrismaError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="An error has occured while adding your answer!")
    print(reply_answer)

    return responses.JSONResponse(status_code=status.HTTP_200_OK, content={"status": "Answer posted successfully!", "question_id": question.id, "answer_id": reply_answer["id"]})



@router.post("/question/{}/answer/{}/upvote", summary="Upvote an answer", response_model_exclude_none=True)
async def upvote_answer(vote: int, user: Annotated[UserProfile, Depends(get_current_user)]):
    """"""
    print(vote)
    return {}
