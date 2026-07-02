class MasterReport:

    def generate(
        self,
        scenario,
        sensor_data,
        ai_result,
        risk_map,
        workers
    ):

        report = {

            "timestamp": sensor_data["timestamp"],

            "plant": {

                "incident": scenario["incident"],

                "state": scenario["state"],

                "zone": scenario["zone"],

                "permit": scenario["permit"],

                "maintenance": scenario["maintenance"]

            },

            "sensor": sensor_data,

            "master_ai": ai_result,

            "risk_map": risk_map,

            "workers": workers

        }

        return report