from sqlalchemy import create_engine, text
from app.core.config import DATABASE_URL

engine = create_engine(DATABASE_URL)

# Create comments table if it doesn't exist
create_table_sql = """
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    post_id INT NOT NULL,
    author_id INT NOT NULL,
    parent_id INT NULL,
    FOREIGN KEY (post_id) REFERENCES posts (id),
    FOREIGN KEY (author_id) REFERENCES users (id),
    FOREIGN KEY (parent_id) REFERENCES comments (id)
);
"""

try:
    with engine.connect() as conn:
        conn.execute(text(create_table_sql))
        conn.commit()
        print("Comments table created successfully!")
except Exception as e:
    print(f"Error creating table: {e}")