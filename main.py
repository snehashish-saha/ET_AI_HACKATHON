import time
from simulator.plant_layout import PLANT_LAYOUT
from simulator.sensor_simulator import SensorSimulator
from simulator.plant_simulator import PlantSimulator


sensor = SensorSimulator()
plant = PlantSimulator()


while True:

    scenario = plant.get_current_scenario()
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

    print("=" * 70)

    time.sleep(1)