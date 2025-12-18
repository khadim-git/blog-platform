import mysql.connector
from mysql.connector import Error

try:
    connection = mysql.connector.connect(
        host='192.168.14.2',
        database='FatsAPi',
        user='root',
        password='MMp9ug6e'
    )
    
    if connection.is_connected():
        cursor = connection.cursor()
        
        # Create categories table
        create_categories_table = """
        CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            slug VARCHAR(100) NOT NULL UNIQUE,
            description VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_categories_name (name),
            INDEX idx_categories_slug (slug)
        )
        """
        
        # Create tags table
        create_tags_table = """
        CREATE TABLE IF NOT EXISTS tags (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE,
            slug VARCHAR(50) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_tags_name (name),
            INDEX idx_tags_slug (slug)
        )
        """
        
        cursor.execute(create_categories_table)
        cursor.execute(create_tags_table)
        
        connection.commit()
        print("Categories and Tags tables created successfully")
        
except Error as e:
    print(f"Error: {e}")
finally:
    if connection.is_connected():
        cursor.close()
        connection.close()