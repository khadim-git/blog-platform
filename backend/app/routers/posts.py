from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_db
from ..models.user import User, UserRole
from ..models.post import Post
from ..models.category import Category
from ..models.tag import Tag
from ..core.security import verify_token
import re

router = APIRouter(prefix="/posts", tags=["posts"])
security = HTTPBearer()

class PostCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    published: bool = False
    image_url: str = None
    category_ids: List[int] = []
    tag_ids: List[int] = []

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    published: Optional[bool] = None
    image_url: Optional[str] = None
    category_ids: Optional[List[int]] = None
    tag_ids: Optional[List[int]] = None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    email = verify_token(credentials.credentials)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    if not user.is_verified:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email not verified")
    return user

def create_slug(title: str) -> str:
    return re.sub(r'[^a-zA-Z0-9]+', '-', title.lower()).strip('-')

# Admin routes first
@router.get("/admin-all")
def get_all_posts_admin(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    posts = db.query(Post).all()
    return [
        {
            "id": p.id, "title": p.title, "slug": p.slug, "content": p.content, 
            "excerpt": p.excerpt, "published": p.published, "image_url": p.image_url,
            "categories": [{"id": c.id, "name": c.name, "slug": c.slug} for c in p.categories],
            "tags": [{"id": t.id, "name": t.name, "slug": t.slug} for t in p.post_tags],
            "author": {"id": p.author.id, "username": p.author.username, "avatar_url": p.author.avatar_url}, 
            "created_at": str(p.created_at), "updated_at": str(p.updated_at)
        } for p in posts
    ]

@router.get("/my-posts")
def get_my_posts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    posts = db.query(Post).filter(Post.author_id == current_user.id).all()
    return [
        {
            "id": p.id, "title": p.title, "slug": p.slug, "content": p.content, 
            "excerpt": p.excerpt, "published": p.published, "image_url": p.image_url,
            "categories": [{"id": c.id, "name": c.name, "slug": c.slug} for c in p.categories],
            "tags": [{"id": t.id, "name": t.name, "slug": t.slug} for t in p.post_tags],
            "author": {"id": p.author.id, "username": p.author.username, "avatar_url": p.author.avatar_url}, 
            "created_at": str(p.created_at), "updated_at": str(p.updated_at)
        } for p in posts
    ]

@router.get("/")
def get_posts(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    posts = db.query(Post).offset(skip).limit(limit).all()
    return [
        {
            "id": p.id, "title": p.title, "slug": p.slug, "content": p.content, 
            "excerpt": p.excerpt, "published": p.published, "image_url": p.image_url,
            "categories": [{"id": c.id, "name": c.name, "slug": c.slug} for c in p.categories],
            "tags": [{"id": t.id, "name": t.name, "slug": t.slug} for t in p.post_tags],
            "author": {"id": p.author.id, "username": p.author.username, "avatar_url": p.author.avatar_url}, 
            "likes_count": len(p.likes),
            "comments_count": len(p.comments),
            "created_at": str(p.created_at), "updated_at": str(p.updated_at)
        } for p in posts
    ]

@router.post("/")
def create_post(post: PostCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    slug = create_slug(post.title)
    
    existing_post = db.query(Post).filter(Post.slug == slug).first()
    if existing_post:
        import time
        slug = f"{slug}-{int(time.time())}"
    
    db_post = Post(
        title=post.title,
        slug=slug,
        content=post.content,
        excerpt=post.excerpt,
        published=post.published,
        image_url=post.image_url,
        author_id=current_user.id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    # Add categories
    if post.category_ids:
        categories = db.query(Category).filter(Category.id.in_(post.category_ids)).all()
        db_post.categories = categories
    
    # Add tags
    if post.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(post.tag_ids)).all()
        db_post.post_tags = tags
    
    db.commit()
    
    return {"message": "Post created successfully", "slug": slug, "id": db_post.id}

@router.put("/{post_id}")
def update_post(post_id: int, post: PostUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if current_user.role != UserRole.admin and db_post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this post")
    
    if post.title is not None:
        db_post.title = post.title
        db_post.slug = create_slug(post.title)
    if post.content is not None:
        db_post.content = post.content
    if post.excerpt is not None:
        db_post.excerpt = post.excerpt
    if post.published is not None:
        db_post.published = post.published
    if post.image_url is not None:
        db_post.image_url = post.image_url
    
    # Update categories
    if post.category_ids is not None:
        categories = db.query(Category).filter(Category.id.in_(post.category_ids)).all()
        db_post.categories = categories
    
    # Update tags
    if post.tag_ids is not None:
        tags = db.query(Tag).filter(Tag.id.in_(post.tag_ids)).all()
        db_post.post_tags = tags
    
    db.commit()
    return {"message": "Post updated successfully"}

@router.delete("/{post_id}")
def delete_post(post_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from ..models.comment import Comment
    from ..models.like import Like
    
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if current_user.role != UserRole.admin and db_post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    
    # Delete related records first
    db.query(Like).filter(Like.post_id == post_id).delete()
    db.query(Comment).filter(Comment.post_id == post_id).delete()
    
    db.delete(db_post)
    db.commit()
    return {"message": "Post deleted successfully"}

@router.get("/{slug_or_id}")
def get_post(slug_or_id: str, db: Session = Depends(get_db)):
    # Try to get by ID first, then by slug
    post = None
    if slug_or_id.isdigit():
        post = db.query(Post).filter(Post.id == int(slug_or_id)).first()
    
    if not post:
        post = db.query(Post).filter(Post.slug == slug_or_id).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return {
        "id": post.id, "title": post.title, "slug": post.slug, "content": post.content,
        "excerpt": post.excerpt, "published": post.published, "image_url": post.image_url,
        "categories": [{"id": c.id, "name": c.name, "slug": c.slug} for c in post.categories],
        "tags": [{"id": t.id, "name": t.name, "slug": t.slug} for t in post.post_tags],
        "author": {"id": post.author.id, "username": post.author.username, "avatar_url": post.author.avatar_url}, 
        "created_at": str(post.created_at), "updated_at": str(post.updated_at)
    }