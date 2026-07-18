import random


class IncidentEngine:
    """
    Simulates realistic industrial incidents.
    Each incident defines the desired operating conditions
    for the entire plant.
    """

    def __init__(self):

        self.incidents = {

            "NORMAL_OPERATION": {

                "incident": "Normal Operation",

                "state": "NORMAL",

                "gas_target": 18,
                "temperature_target": 425,
                "pressure_target": 5.2,
                "humidity_target": 48,

                "maintenance": False,
                "permit": "None",

                "workers": 3,

                "zone": "Boiler Room",

                "risk_level": "LOW"
            },

            "GAS_LEAK": {

                "incident": "Gas Leak",

                "state": "WARNING",

                "gas_target": 55,
                "temperature_target": 435,
                "pressure_target": 6.3,
                "humidity_target": 50,

                "maintenance": False,
                "permit": "None",

                "workers": 4,

                "zone": "Gas Pipeline",

                "risk_level": "MEDIUM"
            },

            "BOILER_OVERHEATING": {

                "incident": "Boiler Overheating",

                "state": "WARNING",

                "gas_target": 22,
                "temperature_target": 475,
                "pressure_target": 8.1,
                "humidity_target": 52,

                "maintenance": False,
                "permit": "None",

                "workers": 3,

                "zone": "Boiler Room",

                "risk_level": "HIGH"
            },

            "HOT_WORK_GAS_LEAK": {

                "incident": "Hot Work During Gas Leak",

                "state": "CRITICAL",

                "gas_target": 82,
                "temperature_target": 500,
                "pressure_target": 9.6,
                "humidity_target": 65,

                "maintenance": True,
                "permit": "Hot Work",

                "workers": 5,

                "zone": "Coke Oven Battery",

                "risk_level": "CRITICAL"
            },

            "VALVE_FAILURE": {

                "incident": "Valve Failure",

                "state": "WARNING",

                "gas_target": 35,
                "temperature_target": 450,
                "pressure_target": 8.8,
                "humidity_target": 53,

                "maintenance": True,
                "permit": "Mechanical",

                "workers": 4,

                "zone": "Valve Station",

                "risk_level": "HIGH"
            },

            "CONFINED_SPACE": {

                "incident": "Confined Space Entry",

                "state": "WARNING",

                "gas_target": 42,
                "temperature_target": 438,
                "pressure_target": 6.8,
                "humidity_target": 58,

                "maintenance": True,
                "permit": "Confined Space",

                "workers": 2,

                "zone": "Storage Tank",

                "risk_level": "HIGH"
            }

        }

    def get_incident(self, name):

        return self.incidents[name]

    def random_incident(self):

        return random.choice(list(self.incidents.values()))