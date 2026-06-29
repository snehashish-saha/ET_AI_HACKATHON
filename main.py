import time

from simulator.plant_layout import PLANT_LAYOUT
from simulator.sensor_simulator import SensorSimulator
from simulator.plant_simulator import PlantSimulator
from simulator.worker_simulator import WorkerSimulator

from AI.risk_zone_engine import RiskZoneEngine
from AI.compound_risk_engine import CompoundRiskEngine


# --------------------------------------------------
# Initialize Modules
# --------------------------------------------------

sensor = SensorSimulator()
plant = PlantSimulator()
worker_sim = WorkerSimulator()

risk_engine = RiskZoneEngine()
compound_ai = CompoundRiskEngine()


# Risk Icons
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

    scenario = plant.get_current_scenario()

    zone_info = PLANT_LAYOUT[scenario["zone"]]

    sensor.update(scenario)

    data = sensor.get_data()

    workers = worker_sim.generate_workers(scenario)

    risk_map = risk_engine.generate_risk_map(scenario)

    ai_result = compound_ai.evaluate(data, scenario)

    print("\n" + "=" * 90)

    print(f"🕒 Timestamp     : {data['timestamp']}")
    print(f"🚨 Incident      : {scenario['incident']}")
    print(f"⚠ Risk Level     : {scenario['risk_level']}")
    print(f"🏭 Plant State   : {scenario['state']}")
    print(f"📍 Zone          : {scenario['zone']}")
    print(f"👷 Workers       : {scenario['workers']}")
    print(f"📄 Permit        : {scenario['permit']}")
    print(f"🔧 Maintenance   : {scenario['maintenance']}")
    print(f"📷 Camera        : {zone_info['camera']}")
    print(f"☣ Hazard        : {zone_info['hazard']}")

    print("\n" + "-" * 90)

    print("📈 LIVE SENSOR DATA\n")

    print(f"⛽ Gas          : {data['gas_ppm']} ppm")
    print(f"🌡 Temperature  : {data['temperature_c']} °C")
    print(f"⚙ Pressure     : {data['pressure_bar']} bar")
    print(f"💧 Humidity     : {data['humidity_percent']} %")

    print("\n" + "-" * 90)

    print("🧠 MASTER AI\n")

    print(f"Overall Risk Score : {ai_result['risk_score']}%")
    print(f"Overall Risk Level : {ICON[ai_result['risk_level']]} {ai_result['risk_level']}")

    print("\nReasons")

    for reason in ai_result["reasons"]:
        print(f"   • {reason}")

    print("\nRecommendations")

    for recommendation in ai_result["recommendations"]:
        print(f"   ✔ {recommendation}")

    print("\n" + "-" * 90)

    print("👷 WORKERS\n")

    for worker in workers:

        print(
            f"{worker['id']} | "
            f"{worker['name']} | "
            f"{worker['zone']} | "
            f"Helmet={worker['helmet']} | "
            f"Vest={worker['vest']} | "
            f"{worker['status']}"
        )

    print("\n" + "-" * 90)

    print("🗺 RISK ZONES\n")

    for zone, info in risk_map.items():

        print(f"{ICON[info['risk']]} {zone:<22} : {info['risk']}")

    print("=" * 90)

    time.sleep(1)