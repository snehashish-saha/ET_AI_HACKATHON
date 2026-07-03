import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))


from fastapi import FastAPI
from report_generator import ReportGenerator
from AI.rag_engine import RAGEngine


app = FastAPI(
    title="Industrial Safety Intelligence API",
    version="1.0"
)

generator = ReportGenerator()
rag = RAGEngine()

#Message 

@app.get("/")
def home():

    return {
        "message": "Industrial Safety Intelligence API Running"
    }


@app.get("/report")
def report():

    return generator.generate_report()

from pydantic import BaseModel


class Question(BaseModel):

    question: str


@app.post("/ask")
def ask_question(data: Question):

    return rag.ask(data.question)

