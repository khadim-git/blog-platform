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
        # First, add 'user' to the existing enum
        cursor.execute("ALTER TABLE users MODIFY COLUMN role ENUM('admin','author','reader','user') DEFAULT 'user'")
        
        # Update existing 'reader' roles to 'user'
        cursor.execute("UPDATE users SET role = 'user' WHERE role = 'reader'")
        
        # Now remove 'reader' from the enum
        cursor.execute("ALTER TABLE users MODIFY COLUMN role ENUM('admin','author','user') DEFAULT 'user'")
        
        connection.commit()
        print("Role enum updated successfully!")
        
        # Verify the changes
        cursor.execute("SELECT id, email, role FROM users")
        users = cursor.fetchall()
        print("Updated users:")
        for user in users:
            print(f"  ID: {user[0]}, Email: {user[1]}, Role: {user[2]}")
            
except Exception as e:
    print(f"Error: {e}")
    connection.rollback()
finally:
    connection.close()