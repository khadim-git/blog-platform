import pymysql
import os

# Railway database URL se connection details nikalo
DATABASE_URL = os.getenv("DATABASE_URL")  # Railway se milega

# Manual connection details
connection = pymysql.connect(
    host='your-railway-host',
    user='root', 
    password='your-password',
    database='railway'
)

# SQL file read karo aur execute karo
with open('FatsAPi.sql', 'r') as file:
    sql_commands = file.read().split(';')
    
cursor = connection.cursor()
for command in sql_commands:
    if command.strip():
        cursor.execute(command)

connection.commit()
connection.close()
print("Database imported successfully!")