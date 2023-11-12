from fastapi import APIRouter


router = APIRouter(
    prefix="/api", tags=["user"], responses={404: {"description": "Not found"}},)


@router.get("/user")
async def get_user():
    return {"hello": "ALXOverflow"}
