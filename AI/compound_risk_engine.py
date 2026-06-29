class CompoundRiskEngine:

    def evaluate(self, sensor_data, scenario):

        risk_score = 0

        reasons = []

        recommendations = []

        # -------------------------------
        # Gas
        # -------------------------------

        gas = sensor_data["gas_ppm"]

        if gas > 60:
            risk_score += 35
            reasons.append("Hazardous gas concentration")

        elif gas > 35:
            risk_score += 20
            reasons.append("Gas concentration rising")

        # -------------------------------
        # Temperature
        # -------------------------------

        temp = sensor_data["temperature_c"]

        if temp > 480:
            risk_score += 20
            reasons.append("Critical temperature")

        elif temp > 450:
            risk_score += 10
            reasons.append("High temperature")

        # -------------------------------
        # Pressure
        # -------------------------------

        pressure = sensor_data["pressure_bar"]

        if pressure > 8:

            risk_score += 20

            reasons.append("Pressure above safe limit")

        elif pressure > 6:

            risk_score += 10

            reasons.append("Pressure increasing")

        # -------------------------------
        # Maintenance
        # -------------------------------

        if scenario["maintenance"]:

            risk_score += 10

            reasons.append("Maintenance activity")

        # -------------------------------
        # Permit
        # -------------------------------

        if scenario["permit"] == "Hot Work":

            risk_score += 15

            reasons.append("Hot Work Permit Active")

        elif scenario["permit"] != "None":

            risk_score += 5

            reasons.append("Permit Active")

        # -------------------------------
        # Incident
        # -------------------------------

        incident = scenario["incident"]

        if incident != "Normal Operation":

            risk_score += 15

            reasons.append(incident)

        # -------------------------------
        # Clamp score
        # -------------------------------

        risk_score = min(risk_score, 100)

        # -------------------------------
        # Overall Level
        # -------------------------------

        if risk_score >= 80:

            level = "CRITICAL"

        elif risk_score >= 60:

            level = "HIGH"

        elif risk_score >= 30:

            level = "MEDIUM"

        else:

            level = "LOW"

        # -------------------------------
        # Recommendations
        # -------------------------------

        if level == "LOW":

            recommendations.append("Continue normal monitoring.")

        if level == "MEDIUM":

            recommendations.append("Increase inspection frequency.")

        if level == "HIGH":

            recommendations.append("Notify safety supervisor.")

            recommendations.append("Reduce operational load.")

        if level == "CRITICAL":

            recommendations.append("Immediate evacuation.")

            recommendations.append("Stop plant operation.")

            recommendations.append("Activate emergency response.")

        return {

            "risk_score": risk_score,

            "risk_level": level,

            "reasons": reasons,

            "recommendations": recommendations

        }