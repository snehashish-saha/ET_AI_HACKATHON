class PredictionEngine:

    def predict(self, sensor):

        predictions = []

        gas = sensor["gas_ppm"]
        temp = sensor["temperature_c"]
        pressure = sensor["pressure_bar"]

        # -----------------------------
        # Gas Prediction
        # -----------------------------

        if gas >= 55:

            predictions.append({
                "parameter": "Gas",
                "prediction": "Critical gas concentration expected within 1 minute.",
                "confidence": 96
            })

        elif gas >= 40:

            predictions.append({
                "parameter": "Gas",
                "prediction": "Gas concentration increasing. Critical level expected within 3 minutes.",
                "confidence": 89
            })

        # -----------------------------
        # Temperature Prediction
        # -----------------------------

        if temp >= 470:

            predictions.append({
                "parameter": "Temperature",
                "prediction": "Boiler overheating likely within 2 minutes.",
                "confidence": 93
            })

        elif temp >= 445:

            predictions.append({
                "parameter": "Temperature",
                "prediction": "Temperature rising steadily.",
                "confidence": 82
            })

        # -----------------------------
        # Pressure Prediction
        # -----------------------------

        if pressure >= 8:

            predictions.append({
                "parameter": "Pressure",
                "prediction": "Pressure may exceed safe operating limit soon.",
                "confidence": 94
            })

        elif pressure >= 6:

            predictions.append({
                "parameter": "Pressure",
                "prediction": "Pressure increasing continuously.",
                "confidence": 83
            })

        # -----------------------------

        if len(predictions) == 0:

            predictions.append({
                "parameter": "System",
                "prediction": "Plant expected to remain stable.",
                "confidence": 98
            })

        return predictions