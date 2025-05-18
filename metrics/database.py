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
                throttling_method TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
        ''')
        conn.commit()
        print("Table created or already exists.")

def insert_metric(operating_system, rendering_type, report, iteration_group, page, throttling_method, timestamp):
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO metrics (operating_system, rendering_type, report, iteration_group, page, throttling_method, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (operating_system, rendering_type, json.dumps(report), iteration_group, page, throttling_method, timestamp))
        conn.commit()

def get_all_metrics():
    with sqlite3.connect(DATABASE) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM metrics')
        rows = cursor.fetchall()
        metrics = []
        
        for row in rows:
            metrics.append({
                "id": row["id"],
                "operating_system": row["operating_system"],
                "rendering_type": row["rendering_type"],
                "report": json.loads(row["report"]),
                "iteration_group": row["iteration_group"],
                "page": row["page"],
                "throttling_method": row["throttling_method"],
                "timestamp": row["timestamp"]
            })
        return metrics
