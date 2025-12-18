#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import DATABASE_URL

def check_posts_slugs():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        try:
            result = connection.execute(text("SELECT id, title, slug FROM posts ORDER BY id;"))
            print("Posts with their slugs:")
            print("ID | Title | Slug")
            print("-" * 50)
            for row in result:
                print(f"{row[0]} | {row[1][:30]}... | {row[2]}")
                
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    check_posts_slugs()