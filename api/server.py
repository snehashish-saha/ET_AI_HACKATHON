import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from report_generator import ReportGenerator
from AI.rag_engine import RAGEngine
from api.db import init_db, insert_alert, get_last_alert, get_alerts, get_alerts_count

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
    
    master_ai = rep.get("master_ai", {})
    risk_level = master_ai.get("risk_level", "LOW")
    
    if risk_level != "LOW":
        plant = rep.get("plant", {})
        zone = plant.get("zone", "Unknown")
        
        last = get_last_alert()
        if not last or last["zone"] != zone or last["risk_level"] != risk_level:
            count = get_alerts_count()
            id_str = f"ALT-{1000 + count}"
            
            scen_key = generator.plant.manual_scenario
            if scen_key is None:
                active_idx = generator.plant.current
                scen_key = generator.plant.incident_names[active_idx]
                
            sensor = rep.get("sensor", {})
            gas = sensor.get("gas_ppm", 0.0)
            temp = sensor.get("temperature_c", 0.0)
            pressure = sensor.get("pressure_bar", 0.0)
            
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
                recommendations=master_ai.get("recommendations", [])
            )
            
    return rep

@app.get("/alerts")
def get_alert_history():
    return get_alerts()

from pydantic import BaseModel


class Question(BaseModel):

    question: str


@app.post("/ask")
def ask_question(data: Question):

    return rag.ask(data.question)

