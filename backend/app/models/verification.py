from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from ..database import Base
import secrets

class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(255), unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    is_used = Column(Boolean, default=False)
    expires_at = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(hours=24))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="verification_tokens")
    
    @classmethod
    def generate_token(cls):
        return secrets.token_urlsafe(32)