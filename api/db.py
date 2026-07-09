import sqlite3
import os
import json

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "kawach.db")

def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    return sqlite3.connect(DB_PATH)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id TEXT PRIMARY KEY,
            scenario_key TEXT,
            timestamp TEXT,
            zone TEXT,
            description TEXT,
            risk_level TEXT,
            risk_score INTEGER,
            gas REAL,
            temp REAL,
            pressure REAL,
            reasons TEXT,
            recommendations TEXT
        )
    """)
    conn.commit()
    conn.close()
    print("SQLite Database initialized at:", DB_PATH)

def get_alerts_count():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM alerts")
    count = cursor.fetchone()[0]
    conn.close()
    return count

def insert_alert(id_str, scenario_key, timestamp, zone, description, risk_level, risk_score, gas, temp, pressure, reasons, recommendations):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO alerts (id, scenario_key, timestamp, zone, description, risk_level, risk_score, gas, temp, pressure, reasons, recommendations)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            id_str,
            scenario_key,
            timestamp,
            zone,
            description,
            risk_level,
            risk_score,
            gas,
            temp,
            pressure,
            json.dumps(reasons),
            json.dumps(recommendations)
        ))
        conn.commit()
    except sqlite3.IntegrityError:
        pass
    finally:
        conn.close()

def get_last_alert():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT zone, risk_level FROM alerts ORDER BY timestamp DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"zone": row[0], "risk_level": row[1]}
    return None

def get_alerts():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, scenario_key, timestamp, zone, description, risk_level, risk_score, gas, temp, pressure, reasons, recommendations
        FROM alerts
        ORDER BY timestamp DESC
        LIMIT 50
    """)
    rows = cursor.fetchall()
    conn.close()
    
    alerts = []
    for r in rows:
        try:
            reasons_list = json.loads(r[10])
        except Exception:
            reasons_list = []
            
        try:
            recs_list = json.loads(r[11])
        except Exception:
            recs_list = []
            
        alerts.append({
            "id": r[0],
            "scenarioKey": r[1],
            "timestamp": r[2],
            "zone": r[3],
            "description": r[4],
            "riskLevel": r[5],
            "riskScore": r[6],
            "sensorVals": {
                "gas": r[7],
                "temp": r[8],
                "pressure": r[9]
            },
            "reasons": reasons_list,
            "recommendations": recs_list
        })
    return alerts
