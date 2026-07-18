import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))


from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from report_generator import ReportGenerator
from AI.rag_engine import RAGEngine
from api.db import init_db, insert_alert, get_last_alert, get_alerts, get_alerts_count, update_alert_status

# Initialize DB on startup
init_db()

app = FastAPI(
    title="Industrial Safety Intelligence API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generator = ReportGenerator()
rag = RAGEngine()

@app.get("/scenario")
def get_scenario():
    if generator.plant.manual_scenario is not None:
        return {"scenario": generator.plant.manual_scenario}
    active_idx = generator.plant.current
    return {"scenario": generator.plant.incident_names[active_idx]}

@app.post("/scenario")
def set_scenario(data: dict):
    scenario = data.get("scenario")
    generator.plant.set_scenario(scenario)
    return {"status": "success", "scenario": scenario}

#Message 

@app.get("/")
def home():

    return {
        "message": "Industrial Safety Intelligence API Running"
    }


@app.get("/report")
def report():
    rep = generator.generate_report()
    
    scen_key = generator.plant.manual_scenario
    if scen_key is None:
        active_idx = generator.plant.current
        scen_key = generator.plant.incident_names[active_idx]
        
    last = get_last_alert()
    if not last or last["scenario_key"] != scen_key:
        count = get_alerts_count()
        id_str = f"ALT-{1000 + count}"
        
        master_ai = rep.get("master_ai", {})
        risk_level = master_ai.get("risk_level", "LOW")
        plant = rep.get("plant", {})
        zone = plant.get("zone", "Unknown")
        sensor = rep.get("sensor", {})
        gas = sensor.get("gas_ppm", 0.0)
        temp = sensor.get("temperature_c", 0.0)
        pressure = sensor.get("pressure_bar", 0.0)
        
        status = 'Resolved' if scen_key == 'NORMAL_OPERATION' else 'Active'
        
        insert_alert(
            id_str=id_str,
            scenario_key=scen_key,
            timestamp=rep.get("timestamp", ""),
            zone=zone,
            description=plant.get("incident", "Anomaly detected"),
            risk_level=risk_level,
            risk_score=master_ai.get("risk_score", 0),
            gas=gas,
            temp=temp,
            pressure=pressure,
            reasons=master_ai.get("reasons", []),
            recommendations=master_ai.get("recommendations", []),
            status=status
        )
        
    return rep

@app.get("/alerts")
def get_alert_history():
    return get_alerts()

class StatusUpdate(BaseModel):
    status: str

@app.post("/alerts/{alert_id}/status")
def update_status(alert_id: str, data: StatusUpdate):
    update_alert_status(alert_id, data.status)
    return {"status": "success", "alert_id": alert_id, "new_status": data.status}




class Question(BaseModel):

    question: str


@app.post("/ask")
def ask_question(data: Question):
    # Fetch current report state
    rep = generator.generate_report()
    plant = rep.get("plant", {})
    sensor = rep.get("sensor", {})
    master_ai = rep.get("master_ai", {})
    
    # Get active alerts
    alerts_list = get_alerts()
    active_alerts = [a for a in alerts_list if a.get("status") == "Active"]
    
    # Construct database logs summary
    alerts_summary = ""
    if alerts_list:
        alerts_summary = "\n".join(
            f"- [{a['timestamp']}] {a['id']}: {a['description']} in {a['zone']} (Status: {a['status']}, Risk: {a['riskLevel']})"
            for a in alerts_list[:5]
        )
    else:
        alerts_summary = "No alerts logged in the system."

    # Construct the formatted live_context string
    live_context = f"""
[LIVE PLANT TELEMETRY - SYSTEM STATUS]
Current Scenario: {plant.get("incident", "NORMAL_OPERATION")} (State: {plant.get("state", "SAFE")})
Active Zone: {plant.get("zone", "None")}

Sensor Values:
- Gas Concentration: {sensor.get("gas_ppm", 0.0)} ppm
- Temperature: {sensor.get("temperature_c", 0.0)} °C
- Pressure: {sensor.get("pressure_bar", 0.0)} bar
- Humidity: {sensor.get("humidity_percent", 0.0)} %

Compound Safety Risk:
- Risk Level: {master_ai.get("risk_level", "LOW")} (Risk Score: {master_ai.get("risk_score", 0)}/100)
- Reasons for Risk: {", ".join(master_ai.get("reasons", ["System operational and stable."]))}
- Action Recommendations: {", ".join(master_ai.get("recommendations", ["No corrective actions needed."]))}

Active Safety Alerts (from SQLite DB):
{alerts_summary}
"""

    # Construct the telemetry dict for local fallback
    live_data_dict = {
        "scenario": plant.get("incident", "NORMAL_OPERATION"),
        "state": plant.get("state", "SAFE"),
        "zone": plant.get("zone", "None"),
        "gas": sensor.get("gas_ppm", 0.0),
        "temperature": sensor.get("temperature_c", 0.0),
        "pressure": sensor.get("pressure_bar", 0.0),
        "risk_level": master_ai.get("risk_level", "LOW"),
        "risk_score": master_ai.get("risk_score", 0),
        "active_alerts": len(active_alerts)
    }

    return rag.ask(data.question, live_context=live_context, live_data_dict=live_data_dict)

