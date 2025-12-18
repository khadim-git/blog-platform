from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routers import auth, posts, comments, users, categories, tags, upload, likes, contact, dashboard
from .models import *  # Import all models to ensure they're registered

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Blog Platform API", 
    version="1.0.0",
    description="Complete blog platform with authentication, posts, and comments"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(comments.router)
app.include_router(users.router)
app.include_router(categories.router)
app.include_router(tags.router)
app.include_router(upload.router)
app.include_router(likes.router)
app.include_router(contact.router)
app.include_router(dashboard.router)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {
        "message": "Blog Platform API", 
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "blog-platform-api"}