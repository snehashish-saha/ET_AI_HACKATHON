import streamlit as st
import pandas as pd
import time
import sys
from pathlib import Path

# Add project root to Python path
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from report_generator import ReportGenerator


generator = ReportGenerator()


st.set_page_config(
    page_title="Industrial Safety Intelligence",
    layout="wide"
)

st.title("🏭 Industrial Safety Intelligence Engine")

placeholder = st.empty()


ICON = {
    "LOW": "🟢",
    "MEDIUM": "🟡",
    "HIGH": "🟠",
    "CRITICAL": "🔴"
}


while True:

    report = generator.generate_report()

    with placeholder.container():

        st.header("🧠 Master AI")

        c1, c2, c3 = st.columns(3)

        c1.metric(
            "Overall Risk",
            report["master_ai"]["risk_level"]
        )

        c2.metric(
            "Incident",
            report["plant"]["incident"]
        )

        c3.metric(
            "Active Zone",
            report["plant"]["zone"]
        )

        st.divider()

        st.header("📈 Live Sensors")

        s1, s2, s3, s4 = st.columns(4)

        s1.metric(
            "Gas (ppm)",
            report["sensor"]["gas_ppm"]
        )

        s2.metric(
            "Temperature (°C)",
            report["sensor"]["temperature_c"]
        )

        s3.metric(
            "Pressure (bar)",
            report["sensor"]["pressure_bar"]
        )

        s4.metric(
            "Humidity (%)",
            report["sensor"]["humidity_percent"]
        )

        st.divider()

        left, right = st.columns([1,1])

        with left:

            st.subheader("🌍 Geospatial Heatmap")

            geo = []

            for zone, level in report["geo_map"].items():

                geo.append({

                    "Zone": zone,

                    "Risk": f"{ICON[level]} {level}"

                })

            st.dataframe(
                pd.DataFrame(geo),
                use_container_width=True,
                hide_index=True
            )

        with right:

            st.subheader("🚨 Active Alerts")

            for reason in report["master_ai"]["reasons"]:

                st.error(reason)

        st.divider()

        st.subheader("👷 Workers")

        st.dataframe(
            pd.DataFrame(report["workers"]),
            use_container_width=True,
            hide_index=True
        )

        st.divider()

        st.subheader("📜 Root Cause Analysis")

        for reason in report["master_ai"]["reasons"]:

            st.write("•", reason)

        st.divider()

        st.subheader("✅ Recommended Actions")

        for recommendation in report["master_ai"]["recommendations"]:

            st.success(recommendation)

    time.sleep(1)

    st.rerun()