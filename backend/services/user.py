from models.user import UserDetails, UserProfile, UserSignUp
from src.db import db
from uuid import uuid4
from datetime import datetime
from src.utils import hash_password


async def create_user_account(user: UserSignUp) -> UserProfile:
    """
    Create a new user account in the system. This function asynchronously
    creates a new user account using the provided UserSignUp details.

    Args:
        user (UserSignUp): A UserSignUp object containing the details for
        creating a new user account.

    Returns:
        UserProfile: A UserProfile object representing the newly created user account.
    """
    # try:
    #     new_user = await db.user.create({
    #         "id": str(uuid4()),
    #         "email": user.email,
    #         "username": user.username,
    #         "password": hash_password(user.password)
    #     })

    #     new_user = {
    #         "id": new_user.id,
    #         "firstname": new_user.first_name,
    #         "lastname": new_user.last_name,
    #         "username": new_user.username,
    #         "email": new_user.email,
    #         "role": new_user.role,
    #         "bio": new_user.bio,
    #         "profile_picture": new_user.profile_picture,
    #         "reputation_score": new_user.reputation_score,
    #         "created_at": new_user.created_at,
    #         "updated_at": new_user.updated_at
    #     }

    #     new_user = UserProfile(**new_user)
    #     return new_user
    # except DataError as e:
    #     pass

    new_user = await db.user.create({
        "id": str(uuid4()),
        "email": user.email,
        "username": user.username,
        "password": hash_password(user.password)
    })

    new_user = {
        "id": new_user.id,
        "firstname": new_user.first_name,
        "lastname": new_user.last_name,
        "username": new_user.username,
        "email": new_user.email,
        "role": new_user.role,
        "bio": new_user.bio,
        "profile_picture": new_user.profile_picture,
        "reputation_score": new_user.reputation_score,
        "created_at": new_user.created_at,
        "updated_at": new_user.updated_at
    }

    new_user = UserProfile(**new_user)
    return new_user


async def update_user_account(user: UserDetails, user_id: str):
    """
    Update user account information in the database. This function 
    asynchronously updates the user account information identified by the
    given user_id.
    
    Args:
        user (UserDetails): A UserDetails object containing the updated user
        information.
        user_id (str): The unique identifier of the user account to be updated.

    Returns:
        dict: A dictionary containing the updated user account details.
    """
    update_user = await db.user.update(where={"id": user_id}, data={
        "first_name": user.first_name,
        "last_name": user.last_name,
        "bio": user.bio,
        "profile_picture": user.profile_picture,
        "username": user.username,
        "updated_at": datetime.now()
    })
    
    user = {
        "id": user_id,
        "firstname": update_user.first_name,
        "lastname": update_user.last_name,
        "username": update_user.username,
        "email": update_user.email,
        "role": update_user.role,
        "bio": update_user.bio,
        "profile_picture": update_user.profile_picture,
        "reputation_score": update_user.reputation_score,
        "created_at": update_user.created_at,
        "updated_at": update_user.updated_at
    }
    return UserDetails(**user)


async def updload_user_profile_image():
    """"""