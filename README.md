# Blog Platform - FastAPI + Next.js

A complete full-stack blog platform with user roles, authentication, and comment system.

## 🚀 Features

### Backend (FastAPI)
- **Authentication**: JWT-based login/register
- **User Roles**: Admin, Author, Reader
- **Posts**: CRUD operations with slug-based URLs
- **Comments**: Approval system for moderation
- **Database**: MySQL with SQLAlchemy ORM
- **Migrations**: Alembic for database versioning

### Frontend (Next.js 14)
- **Modern UI**: Tailwind CSS styling
- **Authentication**: HTTP-only cookie storage
- **Role-based Access**: Different UI for different roles
- **Real-time Comments**: Auto-refresh comment sections
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- MySQL Server

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Setup MySQL database:**
```sql
CREATE DATABASE blog_db;
```

5. **Configure environment variables in `.env`:**
```env
DATABASE_URL=mysql+pymysql://root:your_password@localhost/blog_db
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

6. **Initialize Alembic (optional):**
```bash
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

7. **Seed database with sample data:**
```bash
python seed_data.py
```

8. **Run the server:**
```bash
uvicorn app.main:app --reload
```

Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run development server:**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 🔐 Demo Accounts

After running `seed_data.py`, you can use these accounts:

- **Admin**: admin@blog.com / admin123
- **Author**: author@blog.com / author123  
- **Reader**: reader@blog.com / reader123

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Posts
- `GET /posts/` - List all published posts
- `GET /posts/{slug}` - Get single post by slug
- `POST /posts/` - Create new post (Author/Admin)
- `PUT /posts/{id}` - Update post (Author/Admin)
- `DELETE /posts/{id}` - Delete post (Author/Admin)

### Comments
- `GET /comments/post/{post_id}` - Get approved comments for post
- `POST /comments/` - Create new comment (Authenticated users)
- `PUT /comments/{id}/approve` - Approve comment (Admin only)
- `GET /comments/pending` - Get pending comments (Admin only)

## 🎯 User Roles & Permissions

### Admin
- ✅ Create, edit, delete any posts
- ✅ Approve/reject comments
- ✅ Manage all users
- ✅ Access admin dashboard

### Author
- ✅ Create, edit own posts
- ✅ View comments on own posts
- ✅ Access author dashboard

### Reader
- ✅ Comment on posts
- ✅ View published content
- ✅ Register/login

## 🗂️ Project Structure

```
blog-platform/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── post.py
│   │   │   └── comment.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── posts.py
│   │   │   └── comments.py
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── .env
│   └── seed_data.py
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── dashboard/
    │   │   ├── login/
    │   │   ├── register/
    │   │   └── post/[slug]/
    │   ├── components/
    │   └── lib/
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Deployment

### Backend Deployment
- Deploy to Railway, Heroku, or DigitalOcean
- Set up production MySQL database
- Configure environment variables
- Use `gunicorn` for production server

### Frontend Deployment
- Deploy to Vercel, Netlify, or similar
- Update API base URL for production
- Configure build settings

## 🧪 Testing

### Sample API Tests
```bash
# Register new user
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"test123","role":"reader"}'

# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get all posts
curl "http://localhost:8000/posts/"

# Create post (requires auth token)
curl -X POST "http://localhost:8000/posts/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My First Post","content":"This is my first blog post!","excerpt":"A brief intro","published":true}'
```

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.