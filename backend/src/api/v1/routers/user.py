from fastapi import APIRouter
from src.db import db


router = APIRouter(
    prefix="/api", tags=["user"], responses={404: {"description": "Not found"}},)


@router.get("/user")
async def get_user():
    return {"hello": "ALXOverflow"}
