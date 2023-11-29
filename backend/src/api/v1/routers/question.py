from typing_extensions import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, responses
from starlette import status

from schema.question import CreateQuestion
from schema.user import UserProfile
from services.question import add_question
from src.deps import get_current_user
from src.utils import decode_token
from src.db import db
from prisma import errors

router = APIRouter(prefix="/api/question", tags=["Question"])


@router.post("/question/create", summary="Ask a question", response_model_exclude_none=True)
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
    posts = await db.question.find_many(take=per_page, skip=page-1, include={"answers": {"order_by":
                                        {"created_at": "asc"}}}, order={"created_at": 'desc'})
    pages = 1 if int(
        len(posts) / per_page) == 0 else int(len(posts) / per_page)
    print(posts)


@router.get("/question/{question_id}", summary="Get a question")
async def get_question(question_id: str, user: UserProfile = Depends(get_current_user)):
    """"""
    try:
        question = await db.question.find_unique(where={"id": question_id}, include={"answers": {"order_by":
                                                                                                 {"created_at": "asc"}}})
    except errors.PrismaError as e:
        print("error: ", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="An error has occured!")

    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Question not found!")
    return responses.JSONResponse(status_code=status.HTTP_200_OK, content={**question})


@router.delete("/question/{question_id}", summary="Delete a question")
async def delete_question(question_id: str, user: UserProfile = Depends(get_current_user)):
    """"""
    try:
        question = await db.question.find_unique(where={"id": question_id})
    except errors.PrismaError as e:
        print("error: ", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="An error has occured!")

    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Question not found!")

    return responses.JSONResponse(status_code=status.HTTP_200_OK, content="Question deleted successfully!")
