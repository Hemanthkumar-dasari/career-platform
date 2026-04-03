import MySQLdb
import os
from dotenv import load_dotenv

load_dotenv()

db_user = "root"
db_password = "hemanth@123"
db_host = "localhost"
db_port = 3306
db_name = "career_platform"

try:
    conn = MySQLdb.connect(host=db_host, user=db_user, passwd=db_password, port=db_port, db=db_name)
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print(f"Tables in '{db_name}': {tables}")
    conn.close()
except Exception as e:
    print(f"Failed to connect to '{db_name}': {str(e)}")
