from models.user import UserSignUp
from src.db import db


async def create_user_account(user: UserSignUp):
    """
    Creates a new user account and returns user profile data.
    
    Args:
		user (UserSignup): User data
  
	Return:
		user (User_): User data
    """
    new_user = await db.user.create(**user)
    print("new user: ", new_user)
    return new_user

