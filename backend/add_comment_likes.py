#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import DATABASE_URL

def add_comment_likes():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        try:
            # Add comment_id column to likes table
            connection.execute(text("""
                ALTER TABLE likes 
                ADD COLUMN comment_id INTEGER NULL;
            """))
            
            # Add foreign key constraint
            connection.execute(text("""
                ALTER TABLE likes 
                ADD CONSTRAINT fk_likes_comment 
                FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE;
            """))
            
            # Make post_id nullable
            connection.execute(text("""
                ALTER TABLE likes 
                MODIFY COLUMN post_id INTEGER NULL;
            """))
            
            connection.commit()
            print("Successfully added comment_id to likes table")
            
        except Exception as e:
            print(f"Error: {e}")
            connection.rollback()

if __name__ == "__main__":
    add_comment_likes()