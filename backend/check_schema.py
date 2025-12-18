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
        # Check users table structure
        cursor.execute("DESCRIBE users")
        print("Users table structure:")
        for row in cursor.fetchall():
            print(f"  {row[0]} - {row[1]} - {row[2]} - {row[3]} - {row[4]} - {row[5]}")
        
        # Check if there are any users
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        print(f"\nFound {len(users)} users:")
        for user in users:
            print(f"  ID: {user[0]}, Email: {user[1]}, Username: {user[2]}, Role: {user[4]}, Verified: {user[5]}, Active: {user[6]}")
            
except Exception as e:
    print(f"Error: {e}")
finally:
    connection.close()