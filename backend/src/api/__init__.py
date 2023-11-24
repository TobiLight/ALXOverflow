from fastapi import APIRouter
from src.api.v1.routers.user.user import router as UserRouter
from src.api.v1.routers.auth import router as AuthRouter

api = APIRouter()
api.include_router(UserRouter)
api.include_router(AuthRouter)
__all__ = ["api"]
