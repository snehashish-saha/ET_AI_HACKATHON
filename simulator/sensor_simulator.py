import random
from datetime import datetime


class SensorSimulator:
    """
    Simulates live industrial sensor readings.

    The PlantSimulator provides the target values.
    This class smoothly moves the sensor readings towards those targets.
    """

    def __init__(self):

        # Initial sensor values (Safe State)
        self.gas = 18.0                 # ppm
        self.temperature = 425.0        # °C
        self.pressure = 5.2             # bar
        self.humidity = 48.0            # %

        self.state = "NORMAL"

    def _update_value(self, current, target, variation):
        """
        Smoothly move current value toward target with a little randomness.
        """

        current += (target - current) * 0.12
        current += random.uniform(-variation, variation)

        return round(current, 2)

    def update(self, scenario):
        """
        Update sensor readings according to the current plant scenario.
        """

        self.gas = self._update_value(
            self.gas,
            scenario["gas_target"],
            0.8
        )

        self.temperature = self._update_value(
            self.temperature,
            scenario["temperature_target"],
            1.0
        )

        self.pressure = self._update_value(
            self.pressure,
            scenario["pressure_target"],
            0.05
        )

        self.humidity = self._update_value(
            self.humidity,
            scenario["humidity_target"],
            0.3
        )

        self.state = scenario["state"]

    def get_data(self):
        """
        Return the latest sensor values.
        """

        return {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "gas_ppm": round(self.gas, 2),
            "temperature_c": round(self.temperature, 2),
            "pressure_bar": round(self.pressure, 2),
            "humidity_percent": round(self.humidity, 2),
            "sensor_state": self.state
        }