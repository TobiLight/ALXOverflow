from typing import List, Union
from typing_extensions import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, responses
from starlette import status
from schema.answer import CreateAnswer

from schema.question import CreateQuestion, FetchQuestions, Question
from schema.user import UserProfile
from services.question import add_answer_question, add_question
from src.deps import get_current_user
from src.utils import decode_token
from src.db import db
from prisma import errors
from uuid import uuid4

router = APIRouter(prefix="/api", tags=["Question"], responses={404:
                                                                {"description": "Not found"}},)


@router.post("/question/create", summary="Ask a question", response_model_exclude_none=True)
async def create_question(question_data: CreateQuestion, user: Annotated[UserProfile, Depends(get_current_user)], request: Request):
    """"""
    # print(user.get("id"))
    question = await add_question(question_data, user.get("id"))
    return responses.JSONResponse(status_code=status.HTTP_200_OK, content={"status": "✅ Question created successfully!", "title": question.title, "question_id": question.id})


@router.get("/questions", summary="Get a list of questions", response_model_exclude_none=True)
async def get_questions(question_params: FetchQuestions = None):
    """"""
    print(question_params)
    questions = None
    list_questions: Union[List[Question], None] = []

    if not question_params:
        questions = await db.question.find_many(include={"answers": {"order_by":
                                                                     {"created_at": "asc"}}}, order={"created_at": 'desc'})

    if question_params:
        pass

    if questions:
        for i in range(len(questions)):
            questions_data = questions[i].model_dump()
            del questions_data['author']
            question = Question(**questions_data)
            list_questions.append(question.to_json())

    # pages = 1 if int(
    #     len(questions) / question_params.page) == 0 else int(len(questions) / question_params.per_page)
    return responses.JSONResponse(status_code=status.HTTP_200_OK, content=list_questions)


@router.get("/question/{question_id}", summary="Get a question")
async def get_question(question_id: str):
    """"""
    try:
        question = await db.question.find_unique(where={"id": question_id}, include={"answers": {"order_by":
                                                                                                 {"created_at": "asc"}, "include": {"author": True}}, "author": True})
    except errors.PrismaError as e:
        print("error: ", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="An error has occured!")

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found!")
    question = question.model_dump()
    question = Question(**question)
    return responses.JSONResponse(status_code=status.HTTP_200_OK, content={**question.to_json()})


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


@router.post('/question/{question_id}/answer', summary="Answer a question")
async def answer_question(question_id: str, answer: CreateAnswer, user: Annotated[UserProfile, Depends(get_current_user)]):
    """"""
    question = await db.question.find_unique(where={'id': question_id})
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found!")
    print(question_id)
    try:
        new_answer = await add_answer_question(answer, question.id, user.get("id"))
    except errors.PrismaError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="An error has occured while adding your answer!")
    print(new_answer)
        
    return responses.JSONResponse(status_code=status.HTTP_200_OK, content={"status": "Answer posted successfully!", "question_id": question.id, "answer_id": new_answer["id"]})
