from typing import Union
from fastapi import HTTPException, status
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError, ExpiredSignatureError
from models.token import TokenPayload
from src.db import db
from os import getenv

ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
# should be kept secret
JWT_REFRESH_SECRET_KEY = "kjhgfghjk"

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a plain-text password using a secure hashing algorithm.

    Args:
        password (str): The plain-text password to be hashed.

    Returns:
        str: The hashed representation of the input password.
    """
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    """
    Verify whether a given plain-text password matches a hashed password.

    Args:
        password (str): The plain-text password to be verified.
        hashed_pass (str): The hashed password for comparison.

    Returns:
        bool: True if the plain-text password matches the hashed password,
        False otherwise.
    """
    return password_context.verify(password, hashed_pass)


def create_access_token(payload: TokenPayload) -> str:
    """
    Create an access token for the specified subject with an optional
    expiration time.

    Args:
        subject (Union[str, Any]): The subject for which the access token is
        created.
        expires_delta (Union[int, None]): Optional. The expiration time for the
        access token in seconds from the current time. If not provided or set
        to None, the token may not expire.

    Returns:
        str: The generated access token as a string.
    """
    if payload.exp is not None:
        expires = datetime.now(
            tz=timezone.utc) + timedelta(minutes=payload.exp)
    else:
        expires = datetime.now(
            tz=timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {"user_id": payload.user_id, "exp": expires,
                 #  "sub": str(payload.sub), "iss": payload.iss
                 }
    encoded_jwt = jwt.encode(to_encode, getenv(
        "JWT_SECRET_KEY"), getenv("ALGORITHM"))
    return encoded_jwt


# def create_refresh_token(subject: Union[str, Any], expires_delta: Union[int, None] = None) -> str:
#     if expires_delta is not None:
#         expires_delta = datetime.utcnow() + expires_delta
#     else:
#         expires_delta = datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)

#     to_encode = {"exp": expires_delta, "sub": str(subject)}
#     encoded_jwt = jwt.encode(to_encode, JWT_REFRESH_SECRET_KEY, ALGORITHM)
#     return encoded_jwt

def decode_token(token: str) -> Union[str, None]:
    """"""
    print("incoming token", token)
    try:
        payload = jwt.decode(token, getenv(
            "JWT_SECRET_KEY"), getenv("ALGORITHM"))
        token_data = TokenPayload(**payload)

        # if datetime.fromtimestamp(token_data.exp).timestamp() < datetime.now().timestamp():
        #     raise HTTPException(
        #         status_code=status.HTTP_401_UNAUTHORIZED,
        #         detail="Token expired",
        #         headers={"WWW-Authenticate": "Bearer"},
        #     )
    except (JWTError, ExpiredSignatureError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"Authorization": "Bearer"},
        )
    if token_data.user_id:
        return token_data.user_id
    return None
