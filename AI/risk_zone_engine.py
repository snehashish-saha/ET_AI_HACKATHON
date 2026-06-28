from simulator.plant_layout import PLANT_LAYOUT


class RiskZoneEngine:

    def generate_risk_map(self, scenario):

        risk_map = {}

        for zone, info in PLANT_LAYOUT.items():

            risk = "LOW"

            if zone == scenario["zone"]:
                risk = scenario["risk_level"]

            risk_map[zone] = {

                "risk": risk,

                "camera": info["camera"],

                "hazard": info["hazard"]

            }

        return risk_map