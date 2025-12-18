import pymysql

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
        # Update admin user to be verified
        cursor.execute("UPDATE users SET is_verified = TRUE WHERE email = 'admin@blog.com'")
        connection.commit()
        print("Admin user verified successfully!")
        
except Exception as e:
    print(f"Error: {e}")
finally:
    connection.close()