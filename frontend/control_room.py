import os
import sys

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
import streamlit as st

from simulator.plant_simulator import PlantSimulator
from AI.risk_zone_engine import RiskZoneEngine

# ---------------- PAGE ---------------- #

st.set_page_config(
    page_title="Industrial Safety Control Room",
    page_icon="🏭",
    layout="wide"
)

st.title("🏭 Industrial Safety Control Room")

plant = PlantSimulator()
risk_engine = RiskZoneEngine()

scenario = plant.get_current_scenario()

risk_map = risk_engine.generate_risk_map(scenario)


# ---------------- COLORS ---------------- #

COLOR = {
    "LOW": "#4CAF50",
    "MEDIUM": "#FFC107",
    "HIGH": "#FF9800",
    "CRITICAL": "#F44336"
}


# ---------------- HEADER ---------------- #

st.subheader(f"Current Incident : {scenario['incident']}")

st.write(f"**Plant State :** {scenario['state']}")

st.divider()


# ---------------- DRAW ONE ZONE ---------------- #

def draw_zone(zone_name):

    info = risk_map[zone_name]

    risk = info["risk"]

    color = COLOR[risk]

    st.markdown(
        f"""
        <div style="
            background:{color};
            padding:18px;
            border-radius:12px;
            height:170px;
            color:white;
            font-weight:bold;
        ">
        <h4>{zone_name}</h4>

        Risk : {risk}<br>

        Camera : {info["camera"]}<br>

        Hazard : {info["hazard"]}

        </div>
        """,
        unsafe_allow_html=True
    )


# ---------------- ROW 1 ---------------- #

c1, c2, c3 = st.columns(3)

with c1:
    draw_zone("Boiler Room")

with c2:
    draw_zone("Gas Pipeline")

with c3:
    draw_zone("Coke Oven Battery")


# ---------------- ROW 2 ---------------- #

c1, c2, c3 = st.columns(3)

with c1:
    draw_zone("Valve Station")

with c2:
    draw_zone("Storage Tank")

with c3:
    draw_zone("Control Room")


# ---------------- ROW 3 ---------------- #

c1, c2, c3 = st.columns(3)

with c1:
    draw_zone("Loading Bay")

with c2:
    draw_zone("Parking")

with c3:
    draw_zone("Emergency Exit")