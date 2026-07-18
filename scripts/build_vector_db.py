from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings


# =====================================================
# Paths
# =====================================================

PDF_FOLDER = "knowledge_base/documents"
VECTOR_DB = "knowledge_base/vector_store"


# =====================================================
# Load PDFs
# =====================================================

documents = []

for pdf in Path(PDF_FOLDER).glob("*.pdf"):

    print(f"📄 Loading {pdf.name}")

    loader = PyPDFLoader(str(pdf))

    documents.extend(loader.load())

print(f"\n✅ Loaded {len(documents)} pages")


# =====================================================
# Split Documents
# =====================================================

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=150
)

chunks = splitter.split_documents(documents)

print(f"✅ Created {len(chunks)} chunks")


# =====================================================
# Embeddings
# =====================================================

print("\n🔄 Loading embedding model...")

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# =====================================================
# Build FAISS
# =====================================================

print("🔄 Building FAISS index...")

db = FAISS.from_documents(
    chunks,
    embedding_model
)


# =====================================================
# Save
# =====================================================

db.save_local(VECTOR_DB)

print("\n🎉 Vector Database Created Successfully!")