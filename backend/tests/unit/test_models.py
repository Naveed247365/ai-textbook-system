import pytest
from backend.src.models.user import UserCreate, UserInDB
from pydantic import ValidationError

def test_user_create_model():
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "securepassword"
    }
    user = UserCreate(**user_data)
    assert user.email == "test@example.com"
    assert user.username == "testuser"
    assert user.password == "securepassword"
    with pytest.raises(ValidationError):
        UserCreate(email="invalid-email", username="testuser", password="pass")

def test_user_in_db_model():
    user_in_db_data = {
        "id": 1,
        "email": "dbuser@example.com",
        "username": "dbuser",
        "hashed_password": "hashed_securepassword"
    }
    user_in_db = UserInDB(**user_in_db_data)
    assert user_in_db.id == 1
    assert user_in_db.email == "dbuser@example.com"
    assert user_in_db.username == "dbuser"
    assert user_in_db.hashed_password == "hashed_securepassword"
    with pytest.raises(ValidationError):
        UserInDB(id="not-an-int", email="a@b.com", username="user", hashed_password="hash")
