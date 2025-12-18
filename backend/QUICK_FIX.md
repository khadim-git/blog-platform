# Quick Fix Guide for Uvicorn Error

## Problem
The error `h11_max_incomplete_event_size` indicates version incompatibility between FastAPI, Uvicorn, and related packages.

## Solution Applied

### 1. Updated Dependencies
Updated `requirements.txt` with compatible versions:
- FastAPI: 0.68.0 → 0.104.1
- Uvicorn: 0.15.0 → 0.24.0
- SQLAlchemy: 1.4.23 → 2.0.23
- Pydantic: 1.8.2 → 2.5.0
- Other packages updated accordingly

### 2. Updated Database Configuration
Modified `app/database.py` to use SQLAlchemy 2.0 syntax:
- Changed from `declarative_base()` to `DeclarativeBase` class

### 3. Updated Models
Updated `app/models/user.py` to use SQLAlchemy 2.0 syntax:
- Changed from `Column` to `mapped_column`
- Added type hints with `Mapped`

## How to Run

### Option 1: Using the batch file (Recommended for Windows)
```bash
cd backend
run.bat
```

### Option 2: Manual installation
```bash
cd backend

# Activate virtual environment (if using one)
venv\Scripts\activate

# Install updated dependencies
pip install -r requirements.txt

# Run the server
python run_server.py
```

### Option 3: Using uvicorn directly
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Verification

After starting the server, you should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

Visit:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## Troubleshooting

### If you still get errors:

1. **Clear Python cache:**
```bash
find . -type d -name "__pycache__" -exec rm -r {} +
# Or on Windows:
for /d /r . %d in (__pycache__) do @if exist "%d" rd /s /q "%d"
```

2. **Reinstall dependencies:**
```bash
pip uninstall -y fastapi uvicorn sqlalchemy pydantic
pip install -r requirements.txt
```

3. **Check Python version:**
```bash
python --version
# Should be Python 3.8 or higher
```

4. **Database connection:**
Make sure your MySQL server is running and accessible at the address in `.env`

## Notes

- The updated versions are production-ready and stable
- SQLAlchemy 2.0 syntax is more type-safe and modern
- Pydantic v2 offers better performance
- All changes are backward compatible with your existing database
