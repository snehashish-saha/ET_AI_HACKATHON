import os

from dotenv import load_dotenv
from google import genai


class ExecutiveAI:

    def __init__(self):

        load_dotenv()

        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        self.model = "gemini-3.1-flash-lite"

    def generate(
        self,
        incident,
        zone,
        risk_level,
        reasons,
        recommendations,
        predictions
    ):

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