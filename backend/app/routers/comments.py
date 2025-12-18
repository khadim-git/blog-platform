from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_db
from ..models.user import User, UserRole
from ..models.comment import Comment
from ..models.post import Post
from ..models.like import Like
from ..core.security import verify_token

router = APIRouter(prefix="/comments", tags=["comments"])
security = HTTPBearer()

@router.get("/test")
def test_comments():
    return {"message": "Comments API is working", "status": "ok"}



class CommentCreate(BaseModel):
    content: str
    post_id: int
    parent_id: Optional[int] = None

class CommentResponse(BaseModel):
    id: int
    content: str
    approved: bool
    author: dict
    post_id: int
    created_at: str

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    email = verify_token(credentials.credentials)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    if not user.is_verified:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email not verified")
    return user

@router.get("/post/{post_id}")
def get_comments(post_id: int, db: Session = Depends(get_db)):
    try:
        # Check if post exists
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        # Get parent comments (no parent_id)
        parent_comments = db.query(Comment).filter(
            Comment.post_id == post_id, 
            Comment.approved == True,
            Comment.parent_id.is_(None)
        ).order_by(Comment.created_at.desc()).all()
        
        def get_comment_with_replies(comment):
            try:
                # Get replies for this comment
                replies = db.query(Comment).filter(
                    Comment.parent_id == comment.id,
                    Comment.approved == True
                ).order_by(Comment.created_at.asc()).all()
                
                # Get like count for this comment
                like_count = db.query(func.count(Like.id)).filter(
                    Like.comment_id == comment.id
                ).scalar() or 0
                
                return {
                    "id": comment.id, 
                    "content": comment.content, 
                    "approved": comment.approved,
                    "author": {
                        "id": comment.author.id, 
                        "username": comment.author.username, 
                        "avatar_url": getattr(comment.author, 'avatar_url', None)
                    }, 
                    "post_id": comment.post_id, 
                    "created_at": str(comment.created_at),
                    "like_count": like_count,
                    "replies": [
                        {
                            "id": r.id,
                            "content": r.content,
                            "author": {
                                "id": r.author.id,
                                "username": r.author.username,
                                "avatar_url": getattr(r.author, 'avatar_url', None)
                            },
                            "created_at": str(r.created_at),
                            "like_count": db.query(func.count(Like.id)).filter(
                                Like.comment_id == r.id
                            ).scalar() or 0
                        } for r in replies
                    ]
                }
            except Exception as e:
                print(f"Error processing comment {comment.id}: {e}")
                return {
                    "id": comment.id, 
                    "content": comment.content, 
                    "approved": comment.approved,
                    "author": {
                        "id": comment.author_id, 
                        "username": "Unknown", 
                        "avatar_url": None
                    }, 
                    "post_id": comment.post_id, 
                    "created_at": str(comment.created_at),
                    "replies": []
                }
        
        return [get_comment_with_replies(c) for c in parent_comments]
    except Exception as e:
        print(f"Error in get_comments: {e}")
        return []

@router.post("/")
def create_comment(comment: CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_comment = Comment(
        content=comment.content,
        post_id=comment.post_id,
        author_id=current_user.id,
        parent_id=comment.parent_id,
        approved=True
    )
    db.add(db_comment)
    db.commit()
    return {"message": "Comment posted successfully"}

@router.get("/pending")
def get_pending_comments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    comments = db.query(Comment).filter(Comment.approved == False).order_by(Comment.created_at.desc()).all()
    return [
        {
            "id": c.id, "content": c.content, "post_title": c.post.title,
            "author": {"id": c.author.id, "username": c.author.username}, 
            "post_id": c.post_id, "created_at": str(c.created_at)
        } for c in comments
    ]

@router.get("/my-post/{post_id}")
def get_post_comments(post_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if post exists and user owns it or is admin
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if current_user.role != UserRole.admin and post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.desc()).all()
    return [
        {
            "id": c.id, "content": c.content, "approved": c.approved,
            "author": {"id": c.author.id, "username": c.author.username}, 
            "post_id": c.post_id, "created_at": str(c.created_at)
        } for c in comments
    ]

@router.put("/{comment_id}/approve")
def approve_comment(comment_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check permissions - admin, post author, or author role
    if (current_user.role != UserRole.admin and 
        comment.post.author_id != current_user.id and 
        current_user.role != UserRole.author):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    comment.approved = True
    db.commit()
    return {"message": "Comment approved successfully"}

@router.post("/{comment_id}/like")
def toggle_comment_like(comment_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check if user already liked this comment
    existing_like = db.query(Like).filter(
        Like.comment_id == comment_id,
        Like.user_id == current_user.id
    ).first()
    
    if existing_like:
        # Unlike
        db.delete(existing_like)
        db.commit()
        liked = False
    else:
        # Like
        new_like = Like(
            comment_id=comment_id,
            user_id=current_user.id
        )
        db.add(new_like)
        db.commit()
        liked = True
    
    # Get updated like count
    like_count = db.query(func.count(Like.id)).filter(
        Like.comment_id == comment_id
    ).scalar() or 0
    
    return {
        "liked": liked,
        "like_count": like_count
    }

@router.delete("/{comment_id}")
def delete_comment(comment_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check permissions - admin, post author, or comment author
    if (current_user.role != UserRole.admin and 
        comment.post.author_id != current_user.id and 
        comment.author_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}