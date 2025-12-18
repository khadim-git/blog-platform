from sqlalchemy import Integer, String, DateTime, Enum, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
import enum
from ..database import Base

class UserRole(enum.Enum):
    admin = "admin"
    author = "author"
    user = "user"
    read = "read"
    reader = "reader"

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.user)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    avatar_url: Mapped[str] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    posts = relationship("Post", back_populates="author")
    comments = relationship("Comment", back_populates="author")
    verification_tokens = relationship("EmailVerificationToken", back_populates="user")
    likes = relationship("Like", back_populates="user")