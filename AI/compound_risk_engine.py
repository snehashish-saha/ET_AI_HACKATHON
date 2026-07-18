class CompoundRiskEngine:

    def evaluate(
                self, 
                sensor_data, 
                scenario,
                vision=None
    ):

        self.sensor = sensor_data
        self.scenario = scenario
        self.vision = vision

        self.score = 0
        self.reasons = []
        self.recommendations = []

        # -----------------------
        # Base Sensor Scoring
        # -----------------------

        self._base_sensor_score()

        # -----------------------
        # Compound Rules
        # -----------------------

        self._check_explosion()

        self._check_fire()

        self._check_boiler_failure()

        self._check_process_instability()

        self._check_permit_conflict()

        self._check_emergency_shutdown()

        self._check_vision_risk()

        # -----------------------

        self.score = min(self.score, 100)

        if self.score >= 80:
            level = "CRITICAL"

        elif self.score >= 60:
            level = "HIGH"

        elif self.score >= 30:
            level = "MEDIUM"

        else:
            level = "LOW"

        return {

            "risk_score": self.score,

            "risk_level": level,

            "reasons": self.reasons,

            "recommendations": self.recommendations

        }

    def _check_explosion(self):

        gas = self.sensor["gas_ppm"]

        permit = self.scenario["permit"]

        if gas > 45 and permit == "Hot Work":

            self.score += 30

            self.reasons.append(
                "Explosion risk: hazardous gas with active hot work."
            )

            self.recommendations.append(
                "Cancel Hot Work Permit immediately."
            )

    def _check_fire(self):

        gas = self.sensor["gas_ppm"]

        temp = self.sensor["temperature_c"]

        if gas > 35 and temp > 450:

            self.score += 20

            self.reasons.append(
                "Fire hazard due to high gas and temperature."
            )

            self.recommendations.append(
                "Inspect ignition sources immediately."
            )

    def _check_boiler_failure(self):

        pressure = self.sensor["pressure_bar"]

        temp = self.sensor["temperature_c"]

        if pressure > 8 and temp > 470:

            self.score += 20

            self.reasons.append(
                "Possible boiler failure."
            )

            self.recommendations.append(
                "Reduce boiler load immediately."
            )

    def _check_process_instability(self):

        pressure = self.sensor["pressure_bar"]

        gas = self.sensor["gas_ppm"]

        if pressure > 7 and gas > 40:

            self.score += 15

            self.reasons.append(
                "Process becoming unstable."
            )

            self.recommendations.append(
                "Increase monitoring frequency."
            )

    def _check_permit_conflict(self):

        incident = self.scenario["incident"]

        permit = self.scenario["permit"]

        if incident == "Gas Leak" and permit == "Hot Work":

            self.score += 25

            self.reasons.append(
                "Unsafe permit issued during gas leak."
            )

            self.recommendations.append(
                "Suspend work permit immediately."
            )

    def _check_emergency_shutdown(self):

        gas = self.sensor["gas_ppm"]

        temp = self.sensor["temperature_c"]

        pressure = self.sensor["pressure_bar"]

        if gas > 60 and temp > 480 and pressure > 8:

            self.score += 35

            self.reasons.append(
                "Multiple critical process parameters exceeded."
            )

            self.recommendations.append(
                "Initiate emergency shutdown."
            )

    def _base_sensor_score(self):

        gas = self.sensor["gas_ppm"]
        temp = self.sensor["temperature_c"]
        pressure = self.sensor["pressure_bar"]

        if gas > 60:
            self.score += 20

        elif gas > 35:
            self.score += 10

        if temp > 480:
            self.score += 15

        elif temp > 450:
            self.score += 8

        if pressure > 8:
            self.score += 15

        elif pressure > 6:
            self.score += 8

        if self.scenario["maintenance"]:
            self.score += 5

        if self.scenario["permit"] == "Hot Work":
            self.score += 8
            
    def _check_vision_risk(self):

        if not self.vision:

            return

        for camera, data in self.vision.items():

            if data is None:

                continue

            persons = data.get(
                "person_count",
                0
            )

            if persons > 0:

                self.score += 5

                self.reasons.append(

                    f"{persons} workers detected in {camera}"

                )

