from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime
from ..database import get_db
from ..models.user import User, UserRole
from ..models.verification import EmailVerificationToken
from ..core.security import verify_password, get_password_hash, create_access_token, verify_token
from ..core.email import send_verification_email

router = APIRouter(prefix="/auth", tags=["auth"])

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    role: UserRole = UserRole.user
    avatar_url: str = ''

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class VerifyEmail(BaseModel):
    token: str

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_username = db.query(User).filter(User.username == user.username).first()
    if db_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        role=user.role,
        avatar_url=user.avatar_url,
        is_verified=True  # Auto-verify for development
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Generate verification token
    token = EmailVerificationToken.generate_token()
    verification_token = EmailVerificationToken(
        token=token,
        user_id=db_user.id
    )
    db.add(verification_token)
    db.commit()
    
    # Send verification email
    email_sent = send_verification_email(user.email, token)
    
    return {
        "message": "User registered successfully and verified.",
        "email_sent": False
    }

@router.post("/verify-email")
def verify_email(verify_data: VerifyEmail, db: Session = Depends(get_db)):
    # Find token
    token_record = db.query(EmailVerificationToken).filter(
        EmailVerificationToken.token == verify_data.token,
        EmailVerificationToken.is_used == False,
        EmailVerificationToken.expires_at > datetime.utcnow()
    ).first()
    
    if not token_record:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    # Verify user
    user = db.query(User).filter(User.id == token_record.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_verified = True
    token_record.is_used = True
    db.commit()
    
    return {"message": "Email verified successfully. You can now login."}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Auto-verify for development
    if not db_user.is_verified:
        db_user.is_verified = True
        db.commit()
    
    if not db_user.is_active:
        raise HTTPException(status_code=400, detail="Account is deactivated")
    
    token = create_access_token(data={"sub": user.email})
    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user": {
            "id": db_user.id, 
            "email": db_user.email, 
            "username": db_user.username,
            "role": db_user.role.value
        }
    }

@router.post("/resend-verification")
def resend_verification(email: EmailStr, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_verified:
        raise HTTPException(status_code=400, detail="Email already verified")
    
    # Generate new token
    token = EmailVerificationToken.generate_token()
    verification_token = EmailVerificationToken(
        token=token,
        user_id=user.id
    )
    db.add(verification_token)
    db.commit()
    
    # Send email
    email_sent = send_verification_email(email, token)
    
    return {"message": "Verification email sent", "email_sent": email_sent}