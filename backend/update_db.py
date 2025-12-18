import pymysql

connection = pymysql.connect(
    host='192.168.14.2',
    user='root',
    password='MMp9ug6e',
    database='FatsAPi',
    charset='utf8mb4'
)

try:
    with connection.cursor() as cursor:
        # Add new columns to posts table
        cursor.execute("ALTER TABLE posts ADD COLUMN image_url VARCHAR(500)")
        cursor.execute("ALTER TABLE posts ADD COLUMN tags VARCHAR(500)")
        cursor.execute("ALTER TABLE posts ADD COLUMN category VARCHAR(100)")
        
        # Add avatar column to users table
        cursor.execute("ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500)")
        
        connection.commit()
        print("Database updated successfully!")
        
except Exception as e:
    print(f"Error: {e}")
finally:
    connection.close()