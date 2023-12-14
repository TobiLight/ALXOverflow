from fastapi import APIRouter
from src.api.v1.routers.user.user import router as UserRouter
from src.api.v1.routers.auth import router as AuthRouter
from src.api.v1.routers.question.question import router as QuestionRouter
from src.api.v1.routers.answer.answer import router as AnswerRouter

api = APIRouter()
api.include_router(UserRouter)
api.include_router(AuthRouter)
api.include_router(QuestionRouter)
api.include_router(AnswerRouter)
__all__ = ["api"]
