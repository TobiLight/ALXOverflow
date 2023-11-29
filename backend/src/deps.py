#!/usr/bin/python3
# File: deps.py
# Author: Oluwatobiloba Light
"""Custom dependency for authorization"""

from typing import Any, Dict, Union
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from .utils import decode_token
from models.user import UserDetails
from src.api.v1.routers.auth import oauth2_scheme
from jose import jwt, JWTError, ExpiredSignatureError
from os import getenv


async def get_token_header(request: Request) -> Union[str, None]:
    """"""
    token = ""
    if not request.headers.get("Authorization"):
        return None
    if len(request.headers.get("Authorization").split()) < 2:
        return None
    else:
        token = request.headers.get("Authorization").split()[1]
    print("token ", token)
    
    try:
        decoded_token = jwt.decode(token, getenv(
            "JWT_SECRET_KEY"), getenv("ALGORITHM"))
    except (JWTError, ExpiredSignatureError) as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid credentials!",
                            headers={"Authorization": "Bearer"})
    return decoded_token['user_id']
    

async def get_current_user(user_id: str = Depends(get_token_header)) -> UserDetails:
    """
    Get the current user based on the provided user id.
    
    Args:
        user_id (str): ID of the user
    
    Returns:
        User: An instance of the User model representing the authenticated user.
        
    Raises:
        HTTPException: If the provided token is invalid or if the user
        cannot be authenticated.
    """
    if not user_id:
        return None
    user = await UserDetails.prisma().find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user.to_json()