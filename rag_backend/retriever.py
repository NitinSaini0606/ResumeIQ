import numpy as np
from typing import List, Dict, Any


class RAGRetriever:
    def __init__(self, vector_store, embedding_manager):
        self.vector_store = vector_store
        self.embedding_manager = embedding_manager

    def retrieve(
        self,
        query: str,
        top_k: int = 5,
        score_threshold: float = 0.0,
        company_filter: str = None,
    ) -> List[Dict[str, Any]]:

        query_embedding = self.embedding_manager.generate_embeddings([query])[0]

        try:
            query_kwargs = {
                "query_embeddings": [query_embedding.tolist()],
                "n_results": top_k,
                "include": ["documents", "metadatas", "distances"],
            }
           

            if company_filter:
                query_kwargs["where"] = {"company": {"$eq": company_filter.lower()}}

            results = self.vector_store.collection.query(**query_kwargs)
            

        except Exception as e:
            print(f"Error during retrieval: {e}")
            return []

        docs_list      = results.get("documents",  [[]])[0]
        metadatas_list = results.get("metadatas",  [[]])[0]
        distances_list = results.get("distances",  [[]])[0]
        ids_list       = results.get("ids",        [[]])[0]


        print("FILTER:", company_filter)
        print("Returned companies:", [m.get("company") for m in metadatas_list])

        if not docs_list:
            return []

        retrieved_docs = []
        for doc, meta, dist, doc_id in zip(docs_list, metadatas_list, distances_list, ids_list):
            similarity = max(0.0, 1.0 - (dist / 2.0))
            if similarity >= score_threshold:
                retrieved_docs.append({
                    "content":  doc,
                    "metadata": meta,
                    "score":    round(similarity, 4),
                    "id":       doc_id,
                })

        retrieved_docs.sort(key=lambda x: x["score"], reverse=True)
        return retrieved_docs