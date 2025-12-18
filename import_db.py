import pymysql

try:
    connection = pymysql.connect(
        host='mainline.proxy.rlwy.net',
        port=24864,
        user='root',
        password='vVynycODjhCmipIqIqTVcWukRTMyibzA',
        database='railway',
        charset='utf8mb4'
    )
    
    print("Connected to database!")
    
    with open('FatsAPi.sql', 'r', encoding='utf-8') as file:
        sql_content = file.read()
    
    # Split SQL commands by semicolon
    sql_commands = [cmd.strip() for cmd in sql_content.split(';') if cmd.strip()]
    
    cursor = connection.cursor()
    
    for command in sql_commands:
        if command:
            try:
                cursor.execute(command)
                print(f"Executed: {command[:50]}...")
            except Exception as e:
                print(f"Error: {e}")
    
    connection.commit()
    cursor.close()
    connection.close()
    
    print("Database imported successfully!")
    
except Exception as e:
    print(f"Connection failed: {e}")