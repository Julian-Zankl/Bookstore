import sqlite3
import os
import json

DATABASE = os.path.join(os.getcwd(), 'db', 'metrics.db')

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                operating_system TEXT NOT NULL,
                rendering_type TEXT NOT NULL,
                report TEXT NOT NULL,
                iteration_group INTEGER NOT NULL,
                page TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
        ''')
        conn.commit()
        print("Table created or already exists.")

def insert_metric(operating_system, rendering_type, report, iteration_group, page, timestamp):
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO metrics (operating_system, rendering_type, report, iteration_group, page, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (operating_system, rendering_type, json.dumps(report), iteration_group, page, timestamp))
        conn.commit()

def get_all_metrics():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM metrics')
        rows = cursor.fetchall()
        metrics = []
        
        for row in rows:
            metrics.append({
                "id": row[0],
                "operating_system": row[1],
                "rendering_type": row[2],
                "report": json.loads(row[3]),
                "iteration_group": row[4],
                "page": row[5],
                "timestamp": row[6]
            })
        return metrics
