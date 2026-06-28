import time


class PlantSimulator:
    """
    Controls the overall state of the factory.
    Every 20 seconds it moves to the next scenario.
    """

    def __init__(self):
        self.scenarios = [

    {
        "state": "NORMAL",

        "gas_target": 18,
        "temperature_target": 425,
        "pressure_target": 5.2,
        "humidity_target": 48,

        "maintenance": False,
        "permit": "None",
        "workers": 3,
        "zone": "Boiler Room"
    },

    {
        "state": "MAINTENANCE",

        "gas_target": 24,
        "temperature_target": 435,
        "pressure_target": 5.8,
        "humidity_target": 50,

        "maintenance": True,
        "permit": "Electrical",
        "workers": 4,
        "zone": "Boiler Room"
    },

    {
        "state": "WARNING",

        "gas_target": 40,
        "temperature_target": 455,
        "pressure_target": 7.2,
        "humidity_target": 55,

        "maintenance": True,
        "permit": "Hot Work",
        "workers": 5,
        "zone": "Boiler Room"
    },

    {
        "state": "CRITICAL",

        "gas_target": 80,
        "temperature_target": 500,
        "pressure_target": 9.5,
        "humidity_target": 65,

        "maintenance": True,
        "permit": "Hot Work",
        "workers": 5,
        "zone": "Boiler Room"
    },

    {
        "state": "RECOVERY",

        "gas_target": 22,
        "temperature_target": 430,
        "pressure_target": 5.5,
        "humidity_target": 49,

        "maintenance": False,
        "permit": "None",
        "workers": 2,
        "zone": "Boiler Room"
    }

]

        self.current = 0
        self.last_change = time.time()
        self.duration = 20

    def get_current_scenario(self):
        if time.time() - self.last_change >= self.duration:
            self.current = (self.current + 1) % len(self.scenarios)
            self.last_change = time.time()

        return self.scenarios[self.current]