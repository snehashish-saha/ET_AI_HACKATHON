import time

from simulator.plant_layout import PLANT_LAYOUT
from report_generator import ReportGenerator


# ======================================================
# Initialize Report Generator
# ======================================================

generator = ReportGenerator()


# ======================================================
# Risk Icons
# ======================================================

ICON = {
    "LOW": "🟢",
    "MEDIUM": "🟡",
    "HIGH": "🟠",
    "CRITICAL": "🔴"
}


# ======================================================
# Main Loop
# ======================================================

while True:

    # --------------------------------------------------
    # Get Complete Report
    # --------------------------------------------------

    report = generator.generate_report()

    zone_info = PLANT_LAYOUT[report["plant"]["zone"]]

    # ======================================================
    # Console Dashboard
    # ======================================================

    print("\n" + "=" * 100)

    print(f"🕒 Timestamp      : {report['timestamp']}")
    print(f"🚨 Incident       : {report['plant']['incident']}")
    print(f"🏭 Plant State    : {report['plant']['state']}")
    print(f"📍 Active Zone    : {report['plant']['zone']}")
    print(f"⚠ Risk Level      : {report['master_ai']['risk_level']}")
    print(f"👷 Workers        : {len(report['workers'])}")
    print(f"📄 Permit         : {report['plant']['permit']}")
    print(f"🔧 Maintenance    : {report['plant']['maintenance']}")
    print(f"📷 Camera         : {zone_info['camera']}")
    print(f"☣ Hazard         : {zone_info['hazard']}")

    print("\n" + "-" * 100)

    print("📈 LIVE SENSOR DATA\n")

    print(f"⛽ Gas           : {report['sensor']['gas_ppm']} ppm")
    print(f"🌡 Temperature   : {report['sensor']['temperature_c']} °C")
    print(f"⚙ Pressure      : {report['sensor']['pressure_bar']} bar")
    print(f"💧 Humidity      : {report['sensor']['humidity_percent']} %")

    print("\n" + "-" * 100)

    print("🧠 MASTER AI\n")

    print("\n" + "-" * 100)

    print("📋 EXECUTIVE AI SUMMARY\n")

    print(report["executive_summary"])

    print(f"Overall Risk Score : {report['master_ai']['risk_score']}%")
    print(
        f"Overall Risk Level : "
        f"{ICON[report['master_ai']['risk_level']]} "
        f"{report['master_ai']['risk_level']}"
    )

    print("\n🔍 Root Cause Analysis\n")

    for reason in report["master_ai"]["reasons"]:
        print(f"• {reason}")

    print("\n✅ Recommended Actions\n")

    for recommendation in report["master_ai"]["recommendations"]:
        print(f"✔ {recommendation}")

    print("\n" + "-" * 100)

    print("🔮 AI PREDICTIONS\n")

    for item in report["prediction"]:

        print(
            f"• {item['parameter']}\n"
            f"  Prediction : {item['prediction']}\n"
            f"  Confidence : {item['confidence']}%\n"
        )

    print("\n" + "-" * 100)

    print("👷 WORKERS\n")

    for worker in report["workers"]:

        print(
            f"{worker['id']} | "
            f"{worker['name']} | "
            f"{worker['zone']} | "
            f"Helmet={worker['helmet']} | "
            f"Vest={worker['vest']} | "
            f"{worker['status']}"
        )

    print("\n" + "-" * 100)

    print("🌍 GEOSPATIAL HEATMAP\n")

    for zone, level in report["geo_map"].items():

        print(f"{ICON[level]} {zone:<22} : {level}")

    print("\n" + "-" * 100)

    print("🗺 RISK ZONE ENGINE\n")

    for zone, info in report["risk_map"].items():

        print(f"{ICON[info['risk']]} {zone:<22} : {info['risk']}")

    print("=" * 100)

    time.sleep(1)