#!/usr/bin/python3
# File: deps.py
# Author: Oluwatobiloba Light
"""Custom dependency for authorization"""

from typing import Union, Any
from datetime import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .utils import (
    ALGORITHM,
    JWT_SECRET_KEY
)

from jose import jwt
from pydantic import ValidationError
from models.user import User_, Role
from prisma.models import User
from src.db import db

reuseable_oauth = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
    scheme_name="JWT"
)


async def get_current_user(token: str = Depends(reuseable_oauth)) -> User_:
    # try:
    #     payload = jwt.decode(
    #         token, JWT_SECRET_KEY, algorithms=[ALGORITHM]
    #     )
    #     token_data = TokenPayload(**payload)

    #     if datetime.fromtimestamp(token_data.exp) < datetime.now():
    #         raise HTTPException(
    #             status_code=status.HTTP_401_UNAUTHORIZED,
    #             detail="Token expired",
    #             headers={"WWW-Authenticate": "Bearer"},
    #         )
    # except (jwt.JWTError, ValidationError):
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Could not validate credentials",
    #         headers={"WWW-Authenticate": "Bearer"},
    #     )

    # user: Union[dict[str, Any], None] = db.get(token_data.sub, None)

    # if user is None:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail="Could not find user",
    #     )

    # return User_(**user)
    return User_(User(id=12345, email="", password="", username="er", role='', created_at=datetime.now(), updated_at=datetime.now()))
