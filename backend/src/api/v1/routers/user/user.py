from typing_extensions import Annotated
from fastapi import APIRouter, Depends, Request, status
from schema.user import UserDetails, UserProfile
from services.user import update_user_account
from src.deps import get_current_user
from fastapi.responses import JSONResponse
from src.utils import decode_token


router = APIRouter(
    prefix="/api", tags=["user"], responses={404: {"description": "Not found"}},)



@router.get("/user")
async def get_user(user: Annotated[UserProfile, Depends(get_current_user)]):
    return user


@router.put("/user/profile")
async def update_user(user_update: UserDetails, request: Request,
                      user: Annotated[UserProfile, Depends(get_current_user)]):
    """"""
    del user_update.role
    token = request.headers.get("Authorization").split()[1]
    user_id = decode_token(token)
    await update_user_account(user_update, user_id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=user)
