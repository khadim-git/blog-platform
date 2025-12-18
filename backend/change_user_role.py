#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import DATABASE_URL

def change_user_role(user_id, new_role):
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        try:
            connection.execute(text(f"UPDATE users SET role = '{new_role}' WHERE id = {user_id};"))
            connection.commit()
            print(f"User {user_id} role changed to {new_role}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    # Change user ID 1 back to admin
    change_user_role(1, 'admin')
    # Change user ID 2 to read role for testing
    change_user_role(2, 'read')