import time
from simulator.plant_layout import PLANT_LAYOUT
from simulator.sensor_simulator import SensorSimulator
from simulator.plant_simulator import PlantSimulator
from simulator.worker_simulator import WorkerSimulator
from AI.risk_zone_engine import RiskZoneEngine


sensor = SensorSimulator()
plant = PlantSimulator()
risk_engine = RiskZoneEngine()
worker_sim = WorkerSimulator()


while True:

    scenario = plant.get_current_scenario()
    risk_map = risk_engine.generate_risk_map(scenario)
    workers = worker_sim.generate_workers(scenario)
    zone_info = PLANT_LAYOUT[scenario["zone"]]

    sensor.update(scenario)

    data = sensor.get_data()

    print("=" * 80)

    print(f"Incident    : {scenario['incident']}")
    print(f"Risk Level  : {scenario['risk_level']}")
    print(f"Plant State : {scenario['state']}")
    print(f"Zone        : {scenario['zone']}")
    print(f"Workers     : {scenario['workers']}")
    print(f"Permit      : {scenario['permit']}")
    print(f"Maintenance : {scenario['maintenance']}")
    print(f"Camera      : {zone_info['camera']}")
    print(f"Hazard      : {zone_info['hazard']}")

    print()

    print(data)
    print("\nWorkers")

    for worker in workers:

        print(
            f"{worker['id']} | "
            f"{worker['name']} | "
            f"{worker['zone']} | "
            f"Helmet={worker['helmet']} | "
            f"Vest={worker['vest']} | "
            f"{worker['status']}"
        )

    print("=" * 70)
    print("\nRisk Zones")

    for zone, risk in risk_map.items():

        print(f"{zone:<22} : {risk}")
    time.sleep(1)