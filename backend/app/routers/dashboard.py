from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from ..database import get_db
from ..models.user import User
from ..models.post import Post
from ..models.comment import Comment
from ..models.category import Category
from ..models.tag import Tag
from ..core.security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for admin users"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Basic counts
    total_users = db.query(User).count()
    total_posts = db.query(Post).count()
    total_comments = db.query(Comment).count()
    total_categories = db.query(Category).count()
    
    # Monthly data for the last 12 months
    monthly_data = []
    current_date = datetime.now()
    
    for i in range(12):
        month_start = current_date.replace(day=1) - timedelta(days=30*i)
        month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        posts_count = db.query(Post).filter(
            Post.created_at >= month_start,
            Post.created_at <= month_end
        ).count()
        
        users_count = db.query(User).filter(
            User.created_at >= month_start,
            User.created_at <= month_end
        ).count()
        
        monthly_data.append({
            "month": month_start.strftime("%b"),
            "posts": posts_count,
            "users": users_count
        })
    
    monthly_data.reverse()  # Show oldest to newest
    
    # Category distribution
    category_data = db.query(
        Category.name,
        func.count(Post.id).label('count')
    ).join(
        Post.categories
    ).group_by(Category.name).all()
    
    # Recent activity (last 7 days)
    recent_activity = []
    for i in range(7):
        date = current_date - timedelta(days=i)
        date_start = date.replace(hour=0, minute=0, second=0, microsecond=0)
        date_end = date_start + timedelta(days=1)
        
        posts_count = db.query(Post).filter(
            Post.created_at >= date_start,
            Post.created_at < date_end
        ).count()
        
        users_count = db.query(User).filter(
            User.created_at >= date_start,
            User.created_at < date_end
        ).count()
        
        recent_activity.append({
            "date": date.strftime("%Y-%m-%d"),
            "posts": posts_count,
            "users": users_count
        })
    
    recent_activity.reverse()  # Show oldest to newest
    
    # User role distribution
    from ..models.user import UserRole
    admin_count = db.query(User).filter(User.role == UserRole.admin).count()
    author_count = db.query(User).filter(User.role == UserRole.author).count()
    user_count = db.query(User).filter(User.role == UserRole.user).count()
    
    # Comment status
    pending_comments = db.query(Comment).filter(Comment.approved == False).count()
    approved_comments = db.query(Comment).filter(Comment.approved == True).count()
    
    return {
        "totalUsers": total_users,
        "totalPosts": total_posts,
        "totalComments": total_comments,
        "totalCategories": total_categories,
        "pendingComments": pending_comments,
        "approvedComments": approved_comments,
        "userRoles": {
            "admin": admin_count,
            "author": author_count,
            "user": user_count
        },
        "monthlyPosts": [item["posts"] for item in monthly_data],
        "monthlyUsers": [item["users"] for item in monthly_data],
        "categoryData": [{"name": item[0], "count": item[1]} for item in category_data],
        "recentActivity": recent_activity
    }

@router.get("/recent-posts")
def get_recent_posts(
    limit: int = 5,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recent posts for dashboard"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    posts = db.query(Post).order_by(Post.created_at.desc()).limit(limit).all()
    
    return [{
        "id": post.id,
        "title": post.title,
        "author": post.author.username,
        "created_at": post.created_at,
        "status": post.status
    } for post in posts]

@router.get("/recent-users")
def get_recent_users(
    limit: int = 5,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recent users for dashboard"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = db.query(User).order_by(User.created_at.desc()).limit(limit).all()
    
    return [{
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at,
        "is_verified": user.is_verified
    } for user in users]