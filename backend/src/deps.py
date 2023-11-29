#!/usr/bin/python3
# File: deps.py
# Author: Oluwatobiloba Light
"""Custom dependency for authorization"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .utils import decode_token
from schema.user import UserDetails
from src.api.v1.routers.auth import oauth2_scheme


async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserDetails:
    """
    Get the current user based on the provided OAuth2 access token.
    
    Args:
        token (str): The OAuth2 access token used for user authentication.
    
    Returns:
        User: An instance of the User model representing the authenticated user.
        
    Raises:
        HTTPException: If the provided token is invalid or if the user
        cannot be authenticated.
    """
    user_id = decode_token(token)
    user = await UserDetails.prisma().find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user.to_json()