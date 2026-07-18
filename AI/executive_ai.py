import os

from dotenv import load_dotenv
from google import genai


class ExecutiveAI:

    def __init__(self):

        load_dotenv()

        api_key = os.getenv("LLM_API_KEY")
        if not api_key:
            print("⚠️ WARNING: LLM_API_KEY not found. ExecutiveAI will run in simulation mode.")
            self.client = None
        else:
            try:
                self.client = genai.Client(api_key=api_key)
            except Exception as e:
                print(f"⚠️ WARNING: Failed to initialize Gemini Client: {e}. Running in simulation mode.")
                self.client = None

        self.model = os.getenv(
            "LLM_MODEL",
            "gemini-1.5-flash"
        )

    def generate(
        self,
        incident,
        zone,
        risk_level,
        reasons,
        recommendations,
        predictions
    ):
        if self.client is None:
            reasons_str = f" due to: {', '.join(reasons)}" if reasons else ""
            recs_str = f" Immediate actions required: {'; '.join(recommendations)}" if recommendations else " Continue monitoring parameters."
            return (
                f"[SIMULATED SUMMARY] {incident} detected in {zone}. Risk level is evaluated as {risk_level}{reasons_str}."
                f" Current conditions show active anomalies.{recs_str}"
            )

        prompt = f"""
You are an Industrial Safety Officer.

Analyze the following industrial safety report.

Incident:
{incident}

Zone:
{zone}

Risk Level:
{risk_level}

Root Causes:
{chr(10).join(reasons)}

Recommendations:
{chr(10).join(recommendations)}

Predictions:
{chr(10).join([p["prediction"] for p in predictions])}

Instructions:

- Write a concise executive summary.
- Maximum 120 words.
- Professional tone.
- Do NOT invent facts.
- Mention the risk level.
- Mention the affected zone.
- Mention immediate actions if required.
"""

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )

        return response.text.strip()