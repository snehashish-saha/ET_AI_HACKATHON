class GeospatialEngine:

    def __init__(self):

        # Plant connectivity graph
        self.zone_graph = {

            "Boiler Room": [
                "Valve Station",
                "Control Room"
            ],

            "Valve Station": [
                "Boiler Room",
                "Gas Pipeline"
            ],

            "Gas Pipeline": [
                "Valve Station",
                "Storage Tank"
            ],

            "Storage Tank": [
                "Gas Pipeline",
                "Loading Bay"
            ],

            "Loading Bay": [
                "Storage Tank",
                "Parking"
            ],

            "Parking": [
                "Loading Bay",
                "Emergency Exit"
            ],

            "Emergency Exit": [
                "Parking"
            ],

            "Control Room": [
                "Boiler Room",
                "Coke Oven Battery"
            ],

            "Coke Oven Battery": [
                "Control Room"
            ]

        }

    def propagate_risk(self, incident_zone):

        risk = {}

        # Default all zones to LOW
        for zone in self.zone_graph:

            risk[zone] = "LOW"

        # Incident zone
        risk[incident_zone] = "CRITICAL"

        # Immediate neighbours
        for neighbour in self.zone_graph[incident_zone]:

            risk[neighbour] = "HIGH"

        # Second neighbours
        for neighbour in self.zone_graph[incident_zone]:

            for second in self.zone_graph[neighbour]:

                if risk[second] == "LOW":

                    risk[second] = "MEDIUM"

        return risk