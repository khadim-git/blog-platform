import pymysql
from app.core.config import DATABASE_URL

# Parse DATABASE_URL
url_parts = DATABASE_URL.replace('mysql+pymysql://', '').split('@')
user_pass = url_parts[0].split(':')
host_db = url_parts[1].split('/')
host = host_db[0]
db_name = host_db[1]

conn = pymysql.connect(
    host=host,
    user=user_pass[0],
    password=user_pass[1],
    database=db_name
)

cursor = conn.cursor()

# Convert database
cursor.execute(f"ALTER DATABASE {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")

# Convert posts table
cursor.execute("ALTER TABLE posts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
cursor.execute("ALTER TABLE comments CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")

conn.commit()
cursor.close()
conn.close()

print("Database charset fixed!")
