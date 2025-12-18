#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import DATABASE_URL

def check_likes_table():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        try:
            result = connection.execute(text("DESCRIBE likes;"))
            print("Likes table structure:")
            for row in result:
                print(row)
                
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    check_likes_table()