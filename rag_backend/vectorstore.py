import os
import uuid
from pathlib import Path
import numpy as np
import chromadb
from typing import List, Dict, Any


class VectorStore:
    def __init__(
        self,
        collection_name: str = "company_intel",
        persist_directory: str = "../data/vector_store",
    ):
        self.collection_name = collection_name
        # Resolve relative paths against this file so startup cwd does not matter.
        base_dir = Path(__file__).resolve().parent
        self.persist_directory = str((base_dir / persist_directory).resolve())
        self.client = None
        self.collection = None
        self._initialize_store()

    def _initialize_store(self):
        try:
            os.makedirs(self.persist_directory, exist_ok=True)
            self.client = chromadb.PersistentClient(path=self.persist_directory)
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name,
                metadata={"description": "Company intel documents for RAG"},
            )
            print(f"Vector store ready. Collection: {self.collection_name}")
            print(f"Existing documents: {self.collection.count()}")
        except Exception as e:
            print(f"Error initializing vector store: {e}")
            raise

    def add_documents(self, documents: List[Any], embeddings: np.ndarray):
        if len(documents) != len(embeddings):
            raise ValueError("Number of documents must match number of embeddings")

        ids, metadatas, documents_text, embeddings_list = [], [], [], []

        for i, (doc, embedding) in enumerate(zip(documents, embeddings)):
            doc_id = f"doc_{uuid.uuid4().hex[:8]}_{i}"
            ids.append(doc_id)
            metadata = dict(doc.metadata)
            metadata["doc_index"] = i
            metadata["content_length"] = len(doc.page_content)
            metadatas.append(metadata)
            documents_text.append(doc.page_content)
            embeddings_list.append(embedding.tolist())

        try:
            self.collection.add(
                ids=ids,
                embeddings=embeddings_list,
                metadatas=metadatas,
                documents=documents_text,
            )
            print(f"Added {len(documents)} documents. Total: {self.collection.count()}")
        except Exception as e:
            print(f"Error adding documents: {e}")
            raise

    def clear(self):
        self.client.delete_collection(self.collection_name)
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"description": "Company intel documents for RAG"},
        )
        print(f"Collection '{self.collection_name}' cleared.")