#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import DATABASE_URL

def set_reader_role():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        try:
            # Add reader to enum first
            connection.execute(text("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'author', 'user', 'read', 'reader') DEFAULT 'user';"))
            # Set concierge-user to reader role
            connection.execute(text("UPDATE users SET role = 'reader' WHERE username = 'concierge-user';"))
            connection.commit()
            print("Set concierge-user to reader role")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    set_reader_role()