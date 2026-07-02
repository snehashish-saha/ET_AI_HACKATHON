import time

from simulator.plant_layout import PLANT_LAYOUT
from simulator.sensor_simulator import SensorSimulator
from simulator.plant_simulator import PlantSimulator
from simulator.worker_simulator import WorkerSimulator

from AI.risk_zone_engine import RiskZoneEngine
from AI.compound_risk_engine import CompoundRiskEngine

from master_report import MasterReport


# --------------------------------------------------
# Initialize Modules
# --------------------------------------------------

sensor = SensorSimulator()
plant = PlantSimulator()
worker_sim = WorkerSimulator()

risk_engine = RiskZoneEngine()
compound_ai = CompoundRiskEngine()

master = MasterReport()


# --------------------------------------------------
# Risk Icons
# --------------------------------------------------

ICON = {
    "LOW": "🟢",
    "MEDIUM": "🟡",
    "HIGH": "🟠",
    "CRITICAL": "🔴"
}


# --------------------------------------------------
# Main Loop
# --------------------------------------------------

while True:

    # -------------------------------
    # Generate Simulation Data
    # -------------------------------

    scenario = plant.get_current_scenario()

    sensor.update(scenario)

    sensor_data = sensor.get_data()

    workers = worker_sim.generate_workers(scenario)

    risk_map = risk_engine.generate_risk_map(scenario)

    ai_result = compound_ai.evaluate(sensor_data, scenario)

    report = master.generate(
        scenario,
        sensor_data,
        ai_result,
        risk_map,
        workers
    )

    zone_info = PLANT_LAYOUT[report["plant"]["zone"]]

    # -------------------------------
    # Console Output
    # -------------------------------

    print("\n" + "=" * 95)

    print(f"🕒 Timestamp     : {report['timestamp']}")
    print(f"🚨 Incident      : {report['plant']['incident']}")
    print(f"⚠ Risk Level     : {report['master_ai']['risk_level']}")
    print(f"🏭 Plant State   : {report['plant']['state']}")
    print(f"📍 Zone          : {report['plant']['zone']}")
    print(f"👷 Workers       : {len(report['workers'])}")
    print(f"📄 Permit        : {report['plant']['permit']}")
    print(f"🔧 Maintenance   : {report['plant']['maintenance']}")
    print(f"📷 Camera        : {zone_info['camera']}")
    print(f"☣ Hazard        : {zone_info['hazard']}")

    print("\n" + "-" * 95)

    print("📈 LIVE SENSOR DATA\n")

    print(f"⛽ Gas          : {report['sensor']['gas_ppm']} ppm")
    print(f"🌡 Temperature  : {report['sensor']['temperature_c']} °C")
    print(f"⚙ Pressure     : {report['sensor']['pressure_bar']} bar")
    print(f"💧 Humidity     : {report['sensor']['humidity_percent']} %")

    print("\n" + "-" * 95)

    print("🧠 MASTER AI\n")

    print(f"Overall Risk Score : {report['master_ai']['risk_score']}%")
    print(
        f"Overall Risk Level : "
        f"{ICON[report['master_ai']['risk_level']]} "
        f"{report['master_ai']['risk_level']}"
    )

    print("\nRoot Cause Analysis")

    for reason in report["master_ai"]["reasons"]:
        print(f"   • {reason}")

    print("\nRecommended Actions")

    for recommendation in report["master_ai"]["recommendations"]:
        print(f"   ✔ {recommendation}")

    print("\n" + "-" * 95)

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

    print("\n" + "-" * 95)

    print("🗺 RISK ZONES\n")

    for zone, info in report["risk_map"].items():

        print(f"{ICON[info['risk']]} {zone:<22} : {info['risk']}")

    print("=" * 95)

    time.sleep(1)