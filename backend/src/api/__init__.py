from fastapi import APIRouter
from src.api.v1.routers.user.user import router as UserRouter
from src.api.v1.routers.auth import router as AuthRouter
from src.api.v1.routers.question import router as QuestionRouter

api = APIRouter()
api.include_router(UserRouter)
api.include_router(AuthRouter)
api.include_router(QuestionRouter)
__all__ = ["api"]
