from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_db
from ..models.user import User, UserRole
from ..models.category import Category
from ..core.security import verify_token
import re

router = APIRouter(prefix="/categories", tags=["categories"])
security = HTTPBearer()

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security), db: Session = Depends(get_db)):
    try:
        if not credentials:
            print("No credentials provided")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No token provided")
        email = verify_token(credentials.credentials)
        print(f"Token verified for email: {email}")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"User not found for email: {email}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        if not user.is_verified:
            print(f"User not verified: {email}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email not verified")
        print(f"User authenticated: {user.email}, role: {user.role}")
        return user
    except Exception as e:
        print(f"Authentication error: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

def create_slug(name: str) -> str:
    return re.sub(r'[^a-zA-Z0-9]+', '-', name.lower()).strip('-')

@router.get("/")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    print(f"Found {len(categories)} categories")
    return categories

@router.post("/")
def create_category(category: CategoryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    print(f"User role: {current_user.role}, UserRole.admin: {UserRole.admin}")
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail=f"Admin access required. Current role: {current_user.role}")
    
    slug = create_slug(category.name)
    existing = db.query(Category).filter(Category.slug == slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    
    db_category = Category(name=category.name, slug=slug, description=category.description)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.put("/{category_id}")
def update_category(category_id: int, category: CategoryUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if category.name:
        db_category.name = category.name
        db_category.slug = create_slug(category.name)
    if category.description is not None:
        db_category.description = category.description
    
    db.commit()
    return db_category

@router.delete("/{category_id}")
def delete_category(category_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}