from preprocessor import preprocess_query


def answer_query(
    query: str,
    retriever,
    llm,
    top_k: int = 3,
    company: str = None,
) -> dict:

    cleaned_query = preprocess_query(query)
    print(f"Query: '{query}' → Cleaned: '{cleaned_query}'")

    results = retriever.retrieve(
        cleaned_query,
        top_k=top_k,
        score_threshold=0.0,
        company_filter=company,
    )

    if not results:
        return {
            "answer": "I couldn't find relevant information. Try rephrasing or asking about a specific company.",
            "original_query": query,
            "cleaned_query": cleaned_query,
            "sources": [],
            "chunks_used": 0,
        }

    context = "\n\n".join([r["content"] for r in results])
    sources = list({r["metadata"].get("company", r["metadata"].get("source", "unknown")) for r in results})

    company_context = f" about {company.title()}" if company else ""
    prompt = f"""You are a helpful company intelligence assistant. Use the following context to answer the question{company_context} concisely and accurately.

Context:
{context}

Question: {cleaned_query}

Answer in a clear, helpful way. If the context doesn't fully cover the question, say so honestly."""

    response = llm.invoke(prompt)
    answer = response.content if hasattr(response, "content") else str(response)

    return {
        "answer": answer,
        "original_query": query,
        "cleaned_query": cleaned_query,
        "sources": sources,
        "chunks_used": len(results),
    }