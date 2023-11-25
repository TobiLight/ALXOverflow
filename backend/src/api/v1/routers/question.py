from typing_extensions import Annotated
from fastapi import APIRouter, Depends, Request, responses
from starlette import status

from models.question import CreateQuestion
from models.user import UserProfile
from services.question import add_question
from src.deps import get_current_user
from src.utils import decode_token
from src.db import db

router = APIRouter(prefix="/api/question", tags=["Question"])


@router.post("/question/creare", summary="Ask a question", response_model_exclude_none=True)
async def create_question(question_data: CreateQuestion, user: Annotated[UserProfile, Depends(get_current_user)], request: Request):
    """"""
    token = request.headers.get("Authorization").split()[1]
    user_id = decode_token(token)
    question = await add_question(question_data, user_id)
    return responses.JSONResponse(status_code=status.HTTP_200_OK, content={"status": "✅ Question created successfully!", "title": question.title})

@router.get("/questions", summary="Get a list of questions", response_model_exclude_none=True)
async def get_questions():
    """"""
    per_page = 10
    page = 1
    posts = await db.question.find_many(take=per_page, skip=page-1)
    pages = 1 if int(
        len(posts) / per_page) == 0 else int(len(posts) / per_page)
    print(posts)
    