#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import DATABASE_URL

def check_user_role():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        try:
            result = connection.execute(text("SELECT id, username, email, role FROM users;"))
            print("Users and their roles:")
            for row in result:
                print(f"ID: {row[0]}, Username: {row[1]}, Email: {row[2]}, Role: {row[3]}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    check_user_role()