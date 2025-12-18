from sqlalchemy import create_engine, text
from app.core.config import DATABASE_URL

engine = create_engine(DATABASE_URL)

# Drop and recreate comments table without foreign keys
sql = """
DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    approved BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    post_id INT NOT NULL,
    author_id INT NOT NULL,
    parent_id INT NULL
);
"""

try:
    with engine.connect() as conn:
        for statement in sql.split(';'):
            if statement.strip():
                conn.execute(text(statement))
        conn.commit()
        print("Comments table recreated successfully!")
except Exception as e:
    print(f"Error: {e}")