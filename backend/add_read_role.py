#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import DATABASE_URL

def add_read_role():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        try:
            connection.execute(text("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'author', 'user', 'read') DEFAULT 'user';"))
            connection.commit()
            print("Added read role to enum")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    add_read_role()