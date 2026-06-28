import time

from simulator.sensor_simulator import SensorSimulator
from simulator.plant_simulator import PlantSimulator


sensor = SensorSimulator()
plant = PlantSimulator()


while True:

    scenario = plant.get_current_scenario()

    sensor.update(scenario)

    data = sensor.get_data()

    print("=" * 70)

    print(f"Plant State : {scenario['state']}")
    print(f"Zone        : {scenario['zone']}")
    print(f"Workers     : {scenario['workers']}")
    print(f"Permit      : {scenario['permit']}")
    print(f"Maintenance : {scenario['maintenance']}")

    print()

    print(data)

    print("=" * 70)

    time.sleep(1)