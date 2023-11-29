from typing import Union
from typing_extensions import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from schema.token import TokenPayload, TokenResponse
from services.user import create_user_account
from src.utils import create_access_token, verify_password
from src.db import db
from schema.user import UserSignUpOutput, UserSignUp, UserSignUpOutput
from uuid import uuid4


router = APIRouter(
    prefix="/api/auth", tags=["auth"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


@router.post("/login", summary="User login", response_model=TokenResponse, response_model_exclude_none=True)
async def login_user(sign_in: Annotated[OAuth2PasswordRequestForm, Depends()]):
    """

    """
    existing_user = await db.user.find_unique(where={"email": sign_in.username})
    if existing_user:
        password = verify_password(sign_in.password, existing_user.password)
        if password is False:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, headers={'Authorization': 'Bearer'}, detail="Invalid login!")

        payload = TokenPayload(user_id=existing_user.id, exp=30)
        user_token = create_access_token(payload=payload)
        
        return {"token_type": "bearer", "access_token": user_token}
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

    user = await create_user_account(sign_up)
    return UserSignUpOutput(message="Account created successfully!", user=user)
