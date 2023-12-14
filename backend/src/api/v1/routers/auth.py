from typing import Union
from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from schema.token import TokenPayload
from services.user import create_user_account
from src.utils import create_access_token, verify_password
from src.db import db
from schema.user import UserSignIn, UserSignUpOutput, UserSignUp, UserSignUpOutput


router = APIRouter(
    prefix="/api/auth", tags=["auth"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


@router.post("/login", summary="User login", response_model_exclude_none=True)
async def login_user(sign_in: UserSignIn):
    """

    """
    existing_user = await db.user.find_unique(where={"email": sign_in.email})
    if existing_user:
        password = verify_password(sign_in.password, existing_user.password)
        if password is False:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, headers={'Authorization': 'Bearer'}, detail="Invalid login!")

        payload = TokenPayload(user_id=existing_user.id, exp=10)
        user_token = create_access_token(payload=payload)
        user = {
            "id": existing_user.id,
            "email": existing_user.email,
            "username": existing_user.username,
            "first_name": existing_user.first_name,
            "last_name": existing_user.last_name,
            "profile_picture": existing_user.profile_picture,
            "bio": existing_user.bio,
            "reputation_score": existing_user.reputation_score,
            "role": existing_user.role,
            "created_at": existing_user.created_at,
            "updated_at": existing_user.updated_at
        }

        return {"status": "Ok", "data": user, "access_token": user_token}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid login!")


@router.post("/register", summary='Create a new user', response_model=Union[UserSignUpOutput, dict], response_model_exclude_none=True)
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
    existing_username = await db.user.find_unique(where={"username": sign_up.username})

    if existing_email is not None or existing_username is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email or Username is taken!")

    user = await create_user_account(sign_up)
    return {"status": "Ok", "data": user}
    return UserSignUpOutput(message="Account created successfully!", user=user)
