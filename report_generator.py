import time
from simulator.sensor_simulator import SensorSimulator
from simulator.plant_simulator import PlantSimulator
from simulator.worker_simulator import WorkerSimulator

from AI.risk_zone_engine import RiskZoneEngine
from AI.compound_risk_engine import CompoundRiskEngine
from AI.geospatial_engine import GeospatialEngine

from master_report import MasterReport
from AI.prediction_engine import PredictionEngine
from AI.executive_ai import ExecutiveAI
from AI.vision_engine import VisionEngine

class ReportGenerator:
    """
    Generates one complete plant report.

    This is the single entry point for:
    - Console
    - Streamlit
    - FastAPI
    - React
    - Database
    - Safety System
    """

    def __init__(self): 

        self.sensor = SensorSimulator()

        self.plant = PlantSimulator()

        self.worker = WorkerSimulator()

        self.risk_engine = RiskZoneEngine()

        self.compound_ai = CompoundRiskEngine()

        self.geo_engine = GeospatialEngine()

        self.master = MasterReport()

        self.predictor = PredictionEngine()

        self.executive = ExecutiveAI()
        self.vision = VisionEngine()

        self.last_summary = ""
        self.last_summary_time = 0
        self.last_incident = ""
        self.last_zone = ""
        self.last_risk_level = ""

    def generate_report(self):

        # ---------------------------------------
        # Plant Scenario
        # ---------------------------------------

        scenario = self.plant.get_current_scenario()

        # ---------------------------------------
        # Sensors
        # ---------------------------------------

        self.sensor.update(scenario)

        sensor_data = self.sensor.get_data()

        vision_data = {

            "camera_1":

                self.vision.analyze_video(
                    "videos/cctv1.mp4"
                ),

            "camera_2":

                self.vision.analyze_video(
                    "videos/cctv2.mp4"
                ),

            "camera_3":

                self.vision.analyze_video(
                    "videos/cctv3.mp4"
                ),

            "camera_4":

                self.vision.analyze_video(
                    "videos/cctv4.mp4"
                ),

            "camera_5":

                self.vision.analyze_video(
                    "videos/cctv5.mp4"
                )
        }

        # ---------------------------------------
        # Workers
        # ---------------------------------------

        workers = self.worker.generate_workers(
            scenario
        )

        # ---------------------------------------
        # Risk Engine
        # ---------------------------------------

        risk_map = self.risk_engine.generate_risk_map(
            scenario
        )

        # ---------------------------------------
        # Compound AI
        # ---------------------------------------

        ai_result = self.compound_ai.evaluate(
            sensor_data,
            scenario
        )

        predictions = self.predictor.predict(
            sensor_data
        )

        current_time = time.time()

        incident = scenario.get("incident", "NORMAL_OPERATION")
        zone = scenario.get("zone", "None")
        risk_level = ai_result.get("risk_level", "LOW")

        state_changed = (
            incident != self.last_incident or
            zone != self.last_zone or
            risk_level != self.last_risk_level
        )

        if state_changed or current_time - self.last_summary_time >= 30:
            print("\n📊 Report Summary Refreshed\n")

            self.last_incident = incident
            self.last_zone = zone
            self.last_risk_level = risk_level

            self.last_summary = self.executive.generate(
                incident=incident,
                zone=zone,
                risk_level=risk_level,
                reasons=ai_result["reasons"],
                recommendations=ai_result["recommendations"],
                predictions=predictions
            )

            self.last_summary_time = current_time

        summary = self.last_summary
        # ---------------------------------------
        # Geospatial AI
        # ---------------------------------------

        geo_map = self.geo_engine.propagate_risk(
            scenario["zone"]
        )

        # ---------------------------------------
        # Master Report
        # ---------------------------------------

        report = self.master.generate(
            scenario=scenario,
            sensor_data=sensor_data,
            ai_result=ai_result,
            risk_map=risk_map,
            geo_map=geo_map,
            workers=workers,
            vision=vision_data,
            prediction=predictions,
            executive_summary=summary
        )

        return report