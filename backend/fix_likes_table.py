#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import DATABASE_URL

def fix_likes_table():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        try:
            # Make post_id nullable
            connection.execute(text("""
                ALTER TABLE likes 
                MODIFY COLUMN post_id INTEGER NULL;
            """))
            
            # Add foreign key constraint for comment_id if not exists
            try:
                connection.execute(text("""
                    ALTER TABLE likes 
                    ADD CONSTRAINT fk_likes_comment 
                    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE;
                """))
            except Exception as fk_error:
                print(f"Foreign key constraint might already exist: {fk_error}")
            
            connection.commit()
            print("Successfully updated likes table")
            
        except Exception as e:
            print(f"Error: {e}")
            connection.rollback()

if __name__ == "__main__":
    fix_likes_table()