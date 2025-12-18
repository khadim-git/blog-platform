from app.database import engine
from sqlalchemy import text

# Add parent_id column to comments table
with engine.connect() as conn:
    try:
        # Add parent_id column
        conn.execute(text("ALTER TABLE comments ADD COLUMN parent_id INTEGER"))
        conn.commit()
        print("Successfully added parent_id column")
    except Exception as e:
        print(f"Error: {e}")
        # Column might already exist, continue
        pass
    
    try:
        # Add foreign key constraint
        conn.execute(text("ALTER TABLE comments ADD FOREIGN KEY (parent_id) REFERENCES comments(id)"))
        conn.commit()
        print("Successfully added foreign key constraint")
    except Exception as e:
        print(f"Foreign key error: {e}")