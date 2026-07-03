import os

from dotenv import load_dotenv
from google import genai

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings


class RAGEngine:

    def __init__(self):

        load_dotenv()

        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        self.model = os.getenv(
            "GEMINI_MODEL",
            "gemini-3.1-flash-lite"
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


    def ask(self, question):

        docs = self.db.similarity_search_with_score(
            question,
            k=3
        )

        context = "\n\n".join(
            doc.page_content
            for doc in docs
        )

        prompt = f"""
You are an Industrial Safety Expert.

Answer ONLY using the supplied context.

If the answer is not present, say:

'I could not find this information in the supplied industrial safety manuals.'

Context:

{context}

Question:

{question}

Answer professionally.
"""

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )

        return {

            "answer": response.text,

            "sources": [

                {
                    "document": doc.metadata.get(
                        "source",
                        "Unknown"
                    ),

                    "page": doc.metadata.get(
                        "page",
                        "-"
                    )
                }

                for doc in docs

            ]

        }