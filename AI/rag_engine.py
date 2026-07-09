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
            "standard-model"
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

        if self.client is None:
            # Local fallback: show clean snippets of the matched regulations directly
            clean_context = context.replace("\n\n", " ").strip()
            if len(clean_context) > 400:
                clean_context = clean_context[:400] + "..."
            return {
                "answer": (
                    "⚠️ [GEMINI API KEY MISSING - RUNNING IN LOCAL SEARCH MODE]\n\n"
                    f"Direct text matched from manuals:\n\n\"{clean_context}\""
                ),
                "sources": [
                    {
                        "document": os.path.basename(doc.metadata.get("source", "Unknown")),
                        "page": doc.metadata.get("page", "-")
                    }
                    for doc in docs
                ]
            }

        prompt = f"""
    You are an Industrial Safety Expert.

    Answer ONLY using the supplied context.

    If the answer is not present in the context, say:

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
                    "document": os.path.basename(
                        doc.metadata.get("source", "Unknown")
                    ),

                    "page": doc.metadata.get("page", "-")
                }

                for doc in docs

            ]

        }