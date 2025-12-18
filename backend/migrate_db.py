import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
connection = pymysql.connect(
    host='192.168.14.2',
    user='root',
    password='MMp9ug6e',
    database='FatsAPi',
    charset='utf8mb4'
)

try:
    with connection.cursor() as cursor:
        # Check if columns exist
        cursor.execute("DESCRIBE users")
        columns = [row[0] for row in cursor.fetchall()]
        
        print("Existing columns:", columns)
        
        # Add is_verified column if it doesn't exist
        if 'is_verified' not in columns:
            cursor.execute("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE")
            print("Added is_verified column")
        
        # Add is_active column if it doesn't exist
        if 'is_active' not in columns:
            cursor.execute("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE")
            print("Added is_active column")
        
        # Update existing users to be verified and active
        cursor.execute("UPDATE users SET is_verified = TRUE, is_active = TRUE WHERE is_verified IS NULL OR is_active IS NULL")
        print("Updated existing users")
        
        connection.commit()
        print("Migration completed successfully!")
        
except Exception as e:
    print(f"Error: {e}")
    connection.rollback()
finally:
    connection.close()