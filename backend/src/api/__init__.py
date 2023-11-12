from fastapi import APIRouter
from src.api.v1.routers.user import router as UserRouter

api = APIRouter()
api.include_router(UserRouter)
__all__ = ["api"]
