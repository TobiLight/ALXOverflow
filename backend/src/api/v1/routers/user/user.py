from typing_extensions import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, status
from schema.user import UpdateUser, UserDetails, UserProfile
from services.user import delete_user_account, update_user_account
from src.deps import get_current_user
from fastapi.responses import JSONResponse
from src.utils import decode_token


router = APIRouter(
    prefix="/api", tags=["user"], responses={404:
                                             {"description": "Not found"}},)


@router.get("/user/profile")
async def get_user(user: Annotated[UserProfile, Depends(get_current_user)]):
    return user


@router.put("/user/profile/{user_id}/edit")
async def update_user(user_id: str, user_update: UpdateUser,
                      user: Annotated[UserProfile, Depends(get_current_user)]):
    """"""
    await update_user_account(user_update, user_id)
    return JSONResponse(status_code=status.HTTP_200_OK,
                        content={'status': 'Ok', 'data': {**user}})

@router.delete("/user/profile/{user_id}/delete")
async def delete_user(user_id: str, user: Annotated[UserProfile, Depends(get_current_user)]):
    """"""
    await delete_user_account(user_id)
    return JSONResponse(status_code=status.HTTP_200_OK,
                        content={'status': 'Ok', 'detail': 'Account deleted!'})
