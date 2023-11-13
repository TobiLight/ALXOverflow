from typing import Union
from fastapi import APIRouter, HTTPException
from src.db import db
from model.user import UserSignIn, UserOut


router = APIRouter(
    prefix="/api/auth", tags=["auth"],
    responses={404: {"description": "Not found"}})


@router.post("/login", response_model=Union[UserOut, dict], response_model_exclude_none=True)
async def login_user(sign_in: UserSignIn):
    """

    """
    # get form from user
    # hash password and compare with db

    # allow user login
    existing_user = await db.user.find_unique(where={"email": sign_in.email})
    if existing_user:
        return UserOut(token="somerandomasstoken", user=existing_user)
    raise HTTPException(status_code=401, detail="Invalid login!")
