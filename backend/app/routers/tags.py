from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_db
from ..models.user import User, UserRole
from ..models.tag import Tag
from ..core.security import verify_token
import re

router = APIRouter(prefix="/tags", tags=["tags"])
security = HTTPBearer()

class TagCreate(BaseModel):
    name: str

class TagUpdate(BaseModel):
    name: Optional[str] = None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    email = verify_token(credentials.credentials)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    if not user.is_verified:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email not verified")
    return user

def create_slug(name: str) -> str:
    return re.sub(r'[^a-zA-Z0-9]+', '-', name.lower()).strip('-')

@router.get("/")
def get_tags(db: Session = Depends(get_db)):
    return db.query(Tag).all()

@router.post("/")
def create_tag(tag: TagCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in [UserRole.admin, UserRole.author]:
        raise HTTPException(status_code=403, detail="Author access required")
    
    slug = create_slug(tag.name)
    existing = db.query(Tag).filter(Tag.slug == slug).first()
    if existing:
        return existing
    
    db_tag = Tag(name=tag.name, slug=slug)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

@router.put("/{tag_id}")
def update_tag(tag_id: int, tag: TagUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db_tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    if tag.name:
        db_tag.name = tag.name
        db_tag.slug = create_slug(tag.name)
    
    db.commit()
    return db_tag

@router.delete("/{tag_id}")
def delete_tag(tag_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db_tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    db.delete(db_tag)
    db.commit()
    return {"message": "Tag deleted successfully"}