import os
import uuid
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.config import settings
from app.json_db import read_json, write_json

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
USERS_FILE = os.path.join(BASE_DIR, "data", "users.json")

# Security
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


# Simplified auth for prototype - NO BCRYPT
def verify_password(plain_password, stored_password):
    """Simple plain-text password verification."""
    return plain_password == stored_password

def get_password_hash(password):
    """Simple plain-text password 'hashing' (no hashing)."""
    return password

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_user_by_email(email: str) -> dict | None:
    users = read_json(USERS_FILE)
    for user in users:
        if user.get("email") == email:
            return user
    return None

def create_user_record(user_data: dict) -> dict:
    users = read_json(USERS_FILE)
    new_user = {
        "id": str(uuid.uuid4()),
        "email": user_data["email"],
        "hashed_password": get_password_hash(user_data["password"]),
        "full_name": user_data["full_name"],
        "role": user_data.get("role", "citizen"),
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    users.append(new_user)
    write_json(USERS_FILE, users)
    return new_user

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user

