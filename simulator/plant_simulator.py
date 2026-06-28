import time

from simulator.incident_engine import IncidentEngine


class PlantSimulator:
    """
    Controls which industrial incident is currently active.
    Changes incident every 20 seconds.
    """

    def __init__(self):

        self.engine = IncidentEngine()

        self.incident_names = list(self.engine.incidents.keys())

        self.current = 0

        self.duration = 20

        self.last_change = time.time()

    def get_current_scenario(self):

        if time.time() - self.last_change >= self.duration:

            self.current = (self.current + 1) % len(self.incident_names)

            self.last_change = time.time()

        incident_name = self.incident_names[self.current]

        return self.engine.get_incident(incident_name)