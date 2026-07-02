class MasterReport:

    def generate(
        self,
        scenario,
        sensor_data,
        ai_result,
        risk_map,
        geo_map,
        workers,
        prediction,
        executive_summary
    ):

        return {

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

            "geo_map": geo_map,

            "prediction": prediction,

            "executive_summary": executive_summary,

            "workers": workers
            

        }