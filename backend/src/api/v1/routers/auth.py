from typing import Union
from fastapi import APIRouter, HTTPException, status
from src.utils import create_access_token, hash_password, verify_password
from src.db import db
from models.user import UserProfile, UserSignIn, UserSignInOutput, UserSignUpOutput, UserSignUp, UserSignUpOutput
from uuid import uuid4


router = APIRouter(
    prefix="/api/auth", tags=["auth"],
    responses={404: {"description": "Not found"}})


@router.post("/login", summary="User login", response_model=Union[UserSignInOutput, dict], response_model_exclude_none=True)
async def login_user(sign_in: UserSignIn):
    """

    """
    existing_user = await db.user.find_unique(where={"email": sign_in.email})
    if existing_user:
        password = verify_password(sign_in.password, existing_user.password)
        if password is False:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid login!")

        user_token = create_access_token(subject="123", expires_delta=5)
        user = {
            "id": existing_user.id,
            "firstname": existing_user.first_name,
            "lastname": existing_user.last_name,
            "username": existing_user.username,
            "email": existing_user.email,
            "role": existing_user.role,
            "bio": existing_user.bio,
            "profile_picture": existing_user.profile_picture,
            "reputation_score": existing_user.reputation_score,
            "created_at": existing_user.created_at,
            "updated_at": existing_user.updated_at
        }
        user = UserProfile(**user)
        return UserSignInOutput(token=user_token, user=user)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid login!")


@router.post("/signup", summary='Create a new user', response_model=Union[UserSignUpOutput, dict], response_model_exclude_none=True)
async def create_account(sign_up: UserSignUp):
    """"""
    if len(sign_up.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be 6 or more characters")

    if sign_up.password not in sign_up.cpassword or sign_up.cpassword not in sign_up.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Password does not match!")

    existing_email = await db.user.find_unique(where={"email": sign_up.email})

    if existing_email is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="This email is in use already!")

    user = await db.user.create({
        "id": str(uuid4()),
        "email": sign_up.email,
        "password": hash_password(sign_up.password)
    })
    new_user = {
        "id": user.id,
        "firstname": user.first_name,
        "lastname": user.last_name,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "bio": user.bio,
        "profile_picture": user.profile_picture,
        "reputation_score": user.reputation_score,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    }
    user = UserProfile(**new_user)
    user_token = create_access_token(subject="123", expires_delta=5)
    return UserSignUpOutput(token=user_token, user=user)
