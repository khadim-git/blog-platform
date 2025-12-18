from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.user import User, UserRole
from app.models.post import Post
from app.models.comment import Comment
from app.models.verification import EmailVerificationToken
from app.core.security import get_password_hash
from app.database import Base

Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    # Check if users already exist
    if db.query(User).filter(User.email == "admin@blog.com").first():
        print("Sample data already exists!")
        db.close()
        return
    
    # Create admin user (verified)
    admin = User(
        email="admin@blog.com",
        username="admin",
        hashed_password=get_password_hash("admin123"),
        role=UserRole.admin,
        is_verified=True
    )
    db.add(admin)
    
    # Create author (verified)
    author = User(
        email="author@blog.com",
        username="john_doe",
        hashed_password=get_password_hash("author123"),
        role=UserRole.author,
        is_verified=True
    )
    db.add(author)
    
    # Create regular user (verified)
    user = User(
        email="user@blog.com",
        username="jane_user",
        hashed_password=get_password_hash("user123"),
        role=UserRole.user,
        is_verified=True
    )
    db.add(user)
    
    # Create unverified user for testing
    unverified_user = User(
        email="unverified@blog.com",
        username="unverified_user",
        hashed_password=get_password_hash("unverified123"),
        role=UserRole.user,
        is_verified=False
    )
    db.add(unverified_user)
    
    db.commit()
    
    # Create sample posts
    post1 = Post(
        title="Getting Started with FastAPI and Next.js",
        slug="getting-started-with-fastapi-and-nextjs",
        content="""
        FastAPI is a modern, fast web framework for building APIs with Python 3.7+ based on standard Python type hints.
        
        Key features:
        - Fast: Very high performance, on par with NodeJS and Go
        - Fast to code: Increase the speed to develop features by about 200% to 300%
        - Fewer bugs: Reduce about 40% of human (developer) induced errors
        - Intuitive: Great editor support. Completion everywhere. Less time debugging
        - Easy: Designed to be easy to use and learn. Less time reading docs
        - Short: Minimize code duplication. Multiple features from each parameter declaration
        - Robust: Get production-ready code. With automatic interactive documentation
        
        Next.js is a React framework that gives you building blocks to create web applications.
        """,
        excerpt="Learn how to build modern web applications with FastAPI backend and Next.js frontend",
        published=True,
        author_id=author.id
    )
    
    post2 = Post(
        title="Understanding User Authentication with JWT",
        slug="understanding-user-authentication-with-jwt",
        content="""
        JSON Web Tokens (JWT) are a popular method for handling authentication in modern web applications.
        
        What is JWT?
        JWT is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.
        
        Structure of JWT:
        1. Header: Contains the type of token and signing algorithm
        2. Payload: Contains the claims (user data)
        3. Signature: Used to verify the token hasn't been tampered with
        
        Benefits:
        - Stateless authentication
        - Cross-domain authentication
        - Mobile-friendly
        - Scalable
        """,
        excerpt="Deep dive into JWT authentication and how to implement it securely",
        published=True,
        author_id=author.id
    )
    
    post3 = Post(
        title="Building Scalable Database Models with SQLAlchemy",
        slug="building-scalable-database-models-with-sqlalchemy",
        content="""
        SQLAlchemy is the Python SQL toolkit and Object-Relational Mapping (ORM) library that gives application developers the full power and flexibility of SQL.
        
        Key Concepts:
        1. Declarative Base: Foundation for all model classes
        2. Relationships: Define how tables relate to each other
        3. Sessions: Manage database transactions
        4. Migrations: Handle database schema changes
        
        Best Practices:
        - Use proper indexing
        - Define clear relationships
        - Handle migrations properly
        - Use connection pooling
        """,
        excerpt="Master SQLAlchemy ORM for building robust database applications",
        published=True,
        author_id=admin.id
    )
    
    # Draft post
    draft_post = Post(
        title="Advanced React Patterns (Draft)",
        slug="advanced-react-patterns-draft",
        content="This is a draft post about advanced React patterns...",
        excerpt="Coming soon: Advanced React patterns and best practices",
        published=False,
        author_id=author.id
    )
    
    db.add(post1)
    db.add(post2)
    db.add(post3)
    db.add(draft_post)
    db.commit()
    
    # Create sample comments
    comment1 = Comment(
        content="Great tutorial! Very helpful for beginners. Looking forward to more content like this.",
        post_id=post1.id,
        author_id=user.id,
        approved=True
    )
    
    comment2 = Comment(
        content="The JWT explanation is very clear. Could you also cover refresh tokens in a future post?",
        post_id=post2.id,
        author_id=user.id,
        approved=True
    )
    
    comment3 = Comment(
        content="SQLAlchemy can be tricky at first, but this guide makes it much easier to understand.",
        post_id=post3.id,
        author_id=user.id,
        approved=True
    )
    
    # Pending comment (not approved)
    pending_comment = Comment(
        content="This is a pending comment that needs approval from admin or author.",
        post_id=post1.id,
        author_id=user.id,
        approved=False
    )
    
    db.add(comment1)
    db.add(comment2)
    db.add(comment3)
    db.add(pending_comment)
    db.commit()
    db.close()
    
    print("Database seeded successfully!")
    print("\nDemo Accounts:")
    print("Admin: admin@blog.com / admin123")
    print("Author: author@blog.com / author123")
    print("User: user@blog.com / user123")
    print("Unverified: unverified@blog.com / unverified123 (cannot login)")

if __name__ == "__main__":
    seed_database()