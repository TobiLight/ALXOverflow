from typing_extensions import Annotated
from fastapi import APIRouter, Depends
from models.user import User_, UserProfile
from src.deps import get_current_user
from src.db import db
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(
    prefix="/api", tags=["user"], responses={404: {"description": "Not found"}},)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")



@router.get("/user")
async def get_user(user: Annotated[UserProfile, Depends(get_current_user)]):
    return user
