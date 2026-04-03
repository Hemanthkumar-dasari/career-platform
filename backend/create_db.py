import MySQLdb
import os
from dotenv import load_dotenv

load_dotenv()

# Extract connection info from DATABASE_URL
# mysql://root:hemanth%40123@localhost:3306/career_platform
db_user = "root"
db_password = "hemanth@123"
db_host = "localhost"
db_port = 3306
db_name = "career_platform"

print(f"Connecting to MySQL to create database '{db_name}'...")

try:
    conn = MySQLdb.connect(host=db_host, user=db_user, passwd=db_password, port=db_port)
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
    print(f"Database '{db_name}' created or already exists.")
    conn.close()
except Exception as e:
    print(f"Failed to create database: {str(e)}")
