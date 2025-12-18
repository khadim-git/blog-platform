from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_db
from ..models.user import User, UserRole
from ..core.security import verify_token, get_password_hash

router = APIRouter(prefix="/users", tags=["users"])
security = HTTPBearer()
class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    role: str
    is_verified: bool
    is_active: bool
    avatar_url: Optional[str] = None
    created_at: str

class UserUpdate(BaseModel):
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    username: Optional[str] = None
    email: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    role: UserRole = UserRole.user
    avatar_url: Optional[str] = None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    email = verify_token(credentials.credentials)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    if not user.is_verified:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email not verified")
    return user

@router.get("/authors")
def get_authors(db: Session = Depends(get_db)):
    authors = db.query(User).filter(
        User.role.in_([UserRole.author, UserRole.admin]),
        User.is_active == True
    ).all()
    return [
        {
            "id": u.id, "username": u.username, "role": u.role.value,
            "avatar_url": u.avatar_url, "created_at": str(u.created_at)
        } for u in authors
    ]

@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "role": current_user.role.value,
        "is_verified": current_user.is_verified,
        "is_active": current_user.is_active,
        "avatar_url": current_user.avatar_url,
        "created_at": str(current_user.created_at)
    }

class ProfileUpdate(BaseModel):
    username: str
    email: str
    avatar_url: Optional[str] = None

@router.put("/me")
def update_profile(profile_data: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if username is taken by another user
    existing_user = db.query(User).filter(
        User.username == profile_data.username,
        User.id != current_user.id
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Check if email is taken by another user
    existing_email = db.query(User).filter(
        User.email == profile_data.email,
        User.id != current_user.id
    ).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Update user
    current_user.username = profile_data.username
    current_user.email = profile_data.email
    if profile_data.avatar_url is not None:
        current_user.avatar_url = profile_data.avatar_url
    db.commit()
    
    return {"message": "Profile updated successfully"}

@router.post("/create")
def create_user(user_data: UserCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        role=user_data.role,
        avatar_url=user_data.avatar_url,
        is_verified=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully", "user_id": new_user.id}

@router.get("/", response_model=List[UserResponse])
def get_all_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = db.query(User).all()
    return [
        {
            "id": u.id, "email": u.email, "username": u.username,
            "role": u.role.value, "is_verified": u.is_verified,
            "is_active": u.is_active, "avatar_url": u.avatar_url,
            "created_at": str(u.created_at)
        } for u in users
    ]

@router.get("/{user_id}")
def get_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.admin and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id, "email": user.email, "username": user.username,
        "role": user.role.value, "is_verified": user.is_verified,
        "is_active": user.is_active, "avatar_url": user.avatar_url,
        "created_at": str(user.created_at)
    }



@router.put("/{user_id}")
def update_user(user_id: int, user_update: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.role is not None:
        user.role = user_update.role
    if user_update.is_active is not None:
        user.is_active = user_update.is_active
    if user_update.username is not None:
        user.username = user_update.username
    if user_update.email is not None:
        user.email = user_update.email
    if user_update.avatar_url is not None:
        user.avatar_url = user_update.avatar_url
    db.commit()
    
    return {"message": "User updated successfully"}

@router.delete("/{user_id}")
def delete_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}