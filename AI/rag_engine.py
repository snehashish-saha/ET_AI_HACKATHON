import os

from dotenv import load_dotenv
from google import genai

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings


class RAGEngine:

    def __init__(self):

        load_dotenv()

        api_key = os.getenv("LLM_API_KEY")
        if not api_key:
            print("⚠️ WARNING: LLM_API_KEY not found. RAGEngine will run in local-search mode.")
            self.client = None
        else:
            try:
                self.client = genai.Client(api_key=api_key)
            except Exception as e:
                print(f"⚠️ WARNING: Failed to initialize Gemini Client for RAG: {e}. Running in local-search mode.")
                self.client = None

        self.model = os.getenv(
            "LLM_MODEL",
            "gemini-1.5-flash"
        )

        print("Loading embedding model...")

        self.embedding = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        print("Loading vector database...")

        self.db = FAISS.load_local(
            "knowledge_base/vector_store",
            self.embedding,
            allow_dangerous_deserialization=True
        )

        print("✅ RAG Engine Ready")


    def ask(self, question, live_context=None, live_data_dict=None):

        results = self.db.similarity_search_with_score(
            question,
            k=3
        )

        docs = []

        for doc, score in results:

            print(f"Similarity Score: {score:.4f}")

            docs.append(doc)

        context = "\n\n".join(
            doc.page_content
            for doc in docs
        )

        is_asking_telemetry = False
        if live_data_dict:
            keywords = ["current", "temperature", "temp", "pressure", "gas", "ppm", "sensor", "value", "val", "alert", "live", "scenario", "zone", "boiler", "tank", "leak", "operating", "normal", "reading", "status"]
            lower_q = question.lower()
            if any(k in lower_q for k in keywords):
                is_asking_telemetry = True

        if self.client is None:
            # Local fallback: show clean snippets of the matched regulations directly
            telemetry_summary = ""
            if is_asking_telemetry and live_data_dict:
                alerts_str = f"{live_data_dict['active_alerts']} Active" if live_data_dict['active_alerts'] > 0 else "0 (Safe)"
                telemetry_summary = (
                    f"Current Plant Live Telemetry:\n"
                    f"- Scenario: {live_data_dict['scenario']} in {live_data_dict['zone']} ({live_data_dict['state']})\n"
                    f"- Risk Level: {live_data_dict['risk_level']} (Score: {live_data_dict['risk_score']}/100)\n"
                    f"- Gas Level: {live_data_dict['gas']} ppm\n"
                    f"- Temperature: {live_data_dict['temperature']} °C\n"
                    f"- Pressure: {live_data_dict['pressure']} bar\n"
                    f"- Active Alerts in SQLite: {alerts_str}\n\n"
                )

            clean_context = context.replace("\n\n", " ").strip()
            if len(clean_context) > 400:
                clean_context = clean_context[:400] + "..."
            return {
                "answer": (
                    "⚠️ [GEMINI API KEY MISSING - RUNNING IN LOCAL SEARCH MODE]\n\n"
                    f"{telemetry_summary}"
                    f"Direct text matched from safety manuals:\n\n\"{clean_context}\""
                ),
                "sources": [
                    {
                        "document": os.path.basename(doc.metadata.get("source", "Unknown")),
                        "page": doc.metadata.get("page", "-")
                    }
                    for doc in docs
                ]
            }

        prompt_context = f"Safety Regulation Context (retrieved from manuals):\n{context}"
        if live_context:
            prompt_context = f"Live Plant Telemetry & Current Status:\n{live_context}\n\n" + prompt_context

        prompt = f"""
    You are an Industrial Safety Expert with access to the plant's live telemetry, active alerts database, and safety regulations.

    Context:
    {prompt_context}

    Question:
    {question}

    Instructions:
    - Answer the question professionally.
    - If the user asks about the current state of the plant, sensor values, or active alerts, refer to the Live Plant Telemetry section.
    - If the user asks about regulations, compliance standards (OSHA/OISD/PNGRB), or general safety guidance, refer to the Safety Regulation Context.
    - Do NOT invent facts. Keep answers concise and strictly grounded.
    """

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )

        return {

            "answer": response.text,

            "sources": [

                {
                    "document": os.path.basename(
                        doc.metadata.get("source", "Unknown")
                    ),

                    "page": doc.metadata.get("page", "-")
                }

                for doc in docs

            ]

        }