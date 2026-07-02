from simulator.sensor_simulator import SensorSimulator
from simulator.plant_simulator import PlantSimulator
from simulator.worker_simulator import WorkerSimulator

from AI.risk_zone_engine import RiskZoneEngine
from AI.compound_risk_engine import CompoundRiskEngine
from AI.geospatial_engine import GeospatialEngine

from master_report import MasterReport
from AI.prediction_engine import PredictionEngine

class ReportGenerator:
    """
    Generates one complete plant report.

    This is the single entry point for:
    - Console
    - Streamlit
    - FastAPI
    - React
    - Database
    - Gemini
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
            prediction=predictions
        )

        return report