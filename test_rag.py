from AI.rag_engine import RAGEngine

rag = RAGEngine()

while True:

    print("\n" + "=" * 70)

    question = input("Ask a question (type 'exit' to quit): ")

    if question.lower() == "exit":
        break

    result = rag.ask(question)

    print("\n📚 Answer:\n")
    print(result["answer"])

    print("\n📄 Sources:\n")

    for source in result["sources"]:

        print(
            f"{source['document']} "
            f"(Page {source['page']})"
        )