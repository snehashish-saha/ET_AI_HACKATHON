import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import streamlit as st
import pandas as pd
import time

from simulator.sensor_simulator import SensorSimulator
from simulator.plant_simulator import PlantSimulator

# ---------------- PAGE CONFIG ---------------- #

st.set_page_config(
    page_title="Industrial Safety Intelligence",
    page_icon="🏭",
    layout="wide"
)

# ---------------- SIMULATORS ---------------- #

sensor = SensorSimulator()
plant = PlantSimulator()

# ---------------- HISTORY ---------------- #

if "history" not in st.session_state:
    st.session_state.history = pd.DataFrame(
        columns=[
            "Time",
            "Gas",
            "Temperature",
            "Pressure",
            "Humidity"
        ]
    )

# ---------------- TITLE ---------------- #

st.title("🏭 Industrial Safety Intelligence Dashboard")

status_placeholder = st.empty()

metrics_placeholder = st.empty()

charts_placeholder = st.empty()

info_placeholder = st.empty()

# ---------------- LIVE LOOP ---------------- #

while True:

    scenario = plant.get_current_scenario()

    sensor.update(scenario)

    data = sensor.get_data()

    # ---------------- STATUS ---------------- #

    state = scenario["state"]

    if state == "NORMAL":
        status_placeholder.success("🟢 MASTER AI : Plant Operating Normally")

    elif state == "MAINTENANCE":
        status_placeholder.info("🔵 MASTER AI : Scheduled Maintenance Running")

    elif state == "WARNING":
        status_placeholder.warning("🟡 MASTER AI : Rising Risk Detected")

    elif state == "CRITICAL":
        status_placeholder.error("🔴 MASTER AI : Immediate Action Required!")

    elif state == "RECOVERY":
        status_placeholder.success("🟢 MASTER AI : Plant Recovering")

    # ---------------- METRICS ---------------- #

    with metrics_placeholder.container():

        c1, c2, c3, c4 = st.columns(4)

        c1.metric(
            "⛽ Gas",
            f"{data['gas_ppm']} ppm"
        )

        c2.metric(
            "🌡 Temperature",
            f"{data['temperature_c']} °C"
        )

        c3.metric(
            "⚙ Pressure",
            f"{data['pressure_bar']} bar"
        )

        c4.metric(
            "💧 Humidity",
            f"{data['humidity_percent']} %"
        )

    # ---------------- HISTORY ---------------- #

    new_row = {
        "Time": data["timestamp"],
        "Gas": data["gas_ppm"],
        "Temperature": data["temperature_c"],
        "Pressure": data["pressure_bar"],
        "Humidity": data["humidity_percent"]
    }

    st.session_state.history = pd.concat(
        [
            st.session_state.history,
            pd.DataFrame([new_row])
        ],
        ignore_index=True
    )

    if len(st.session_state.history) > 40:
        st.session_state.history = st.session_state.history.iloc[-40:]

    # ---------------- CHARTS ---------------- #

    with charts_placeholder.container():

        st.subheader("📈 Live Sensor Trends")

        col1, col2 = st.columns(2)

        with col1:
            st.line_chart(
                st.session_state.history.set_index("Time")[
                    ["Gas", "Temperature"]
                ]
            )

        with col2:
            st.line_chart(
                st.session_state.history.set_index("Time")[
                    ["Pressure", "Humidity"]
                ]
            )

    # ---------------- INFO ---------------- #

    with info_placeholder.container():

        st.subheader("🏭 Plant Information")

        a, b, c, d = st.columns(4)

        a.metric("Zone", scenario["zone"])

        b.metric("Workers", scenario["workers"])

        c.metric("Permit", scenario["permit"])

        d.metric(
            "Maintenance",
            "YES" if scenario["maintenance"] else "NO"
        )

    time.sleep(1)

    st.rerun()