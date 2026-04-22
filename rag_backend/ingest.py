# import os
# import argparse
# from pathlib import Path

# from langchain_community.document_loaders import DirectoryLoader, TextLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_community.document_loaders import UnstructuredMarkdownLoader
# from embeddings import EmbeddingManager
# from vectorstore import VectorStore

# # ── Config ────────────────────────────────────────────────────────
# # DATA_DIR          = "./data/companies"
# # VECTOR_STORE_DIR  = "./data/vector_store"
# DATA_DIR         = "../data/companies"
# VECTOR_STORE_DIR = "../data/vector_store"
# COLLECTION_NAME   = "company_intel"
# CHUNK_SIZE        = 500
# CHUNK_OVERLAP     = 100


# def ingest(clear_first: bool = False):
#     print("=" * 50)
#     print("RAG Ingestion Pipeline")
#     print("=" * 50)

#     # 1. Init vector store
#     vector_store = VectorStore(
#         collection_name=COLLECTION_NAME,
#         persist_directory=VECTOR_STORE_DIR,
#     )

#     if clear_first:
#         print("Clearing existing collection...")
#         vector_store.clear()

#     # 2. Load all .txt files from data/companies/
#     if not os.path.exists(DATA_DIR):
#         os.makedirs(DATA_DIR, exist_ok=True)
#         print(f"Created {DATA_DIR}/ — add your company .txt files there and re-run.")
#         return

#     # loader = DirectoryLoader(
#     #     DATA_DIR,
#     #     glob="**/*.txt",
#     #     loader_cls=TextLoader,
#     #     loader_kwargs={"encoding": "utf-8"},
#     #     show_progress=False,
#     # )
#     loader = DirectoryLoader(
#         DATA_DIR,
#         glob="**/*.md",
#         loader_cls=UnstructuredMarkdownLoader,
#         show_progress=False,
#     )
#     documents = loader.load()

#     if not documents:
#         print(f"No .txt files found in {DATA_DIR}/")
#         return

#     print(f"Loaded {len(documents)} document(s)")

#     # 3. Attach company name as metadata (derived from filename)
#     for doc in documents:
#         source_path = Path(doc.metadata.get("source", ""))
#         company_name = source_path.stem.lower()   # e.g. "google" from "google.txt"
#         doc.metadata["company"] = company_name

#     # 4. Chunk documents
#     # splitter = RecursiveCharacterTextSplitter(
#     #     chunk_size=CHUNK_SIZE,
#     #     chunk_overlap=CHUNK_OVERLAP,
#     # )
#     splitter = RecursiveCharacterTextSplitter(
#         chunk_size=800,
#         chunk_overlap=150,
#         separators=["\n\n##", "\n\n#", "\n\n", "\n", " "]
#     )
#     chunks = splitter.split_documents(documents)
#     print(f"Created {len(chunks)} chunks (size={CHUNK_SIZE}, overlap={CHUNK_OVERLAP})")

#     # 5. Generate embeddings
#     embedding_manager = EmbeddingManager()
#     texts = [chunk.page_content for chunk in chunks]
#     embeddings = embedding_manager.generate_embeddings(texts)

#     # 6. Store in ChromaDB
#     vector_store.add_documents(chunks, embeddings)

#     print("\nIngestion complete!")
#     print(f"Total docs in vector store: {vector_store.collection.count()}")


# if __name__ == "__main__":
#     parser = argparse.ArgumentParser(description="Ingest company docs into RAG vector store")
#     parser.add_argument("--clear", action="store_true", help="Clear existing collection before ingesting")
#     args = parser.parse_args()
#     ingest(clear_first=args.clear)



import os
import argparse
from pathlib import Path

from langchain_community.document_loaders import DirectoryLoader, UnstructuredMarkdownLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from embeddings import EmbeddingManager
from vectorstore import VectorStore

# ── Config ────────────────────────────────────────────────────────
BASE_DIR         = Path(__file__).resolve().parent
DATA_DIR         = str((BASE_DIR / "../data/companies").resolve())
VECTOR_STORE_DIR = str((BASE_DIR / "../data/vector_store").resolve())
COLLECTION_NAME  = "company_intel"


def ingest(clear_first: bool = False):
    print("=" * 50)
    print("RAG Ingestion Pipeline")
    print("=" * 50)

    # 1. Init vector store
    vector_store = VectorStore(
        collection_name=COLLECTION_NAME,
        persist_directory=VECTOR_STORE_DIR,
    )

    if clear_first:
        print("Clearing existing collection...")
        vector_store.clear()

    # 2. Load all .md files from data/companies/
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR, exist_ok=True)
        print(f"Created {DATA_DIR}/ — add your company .md files there and re-run.")
        return

    loader = DirectoryLoader(
        DATA_DIR,
        glob="**/*.md",
        loader_cls=UnstructuredMarkdownLoader,
        show_progress=False,
    )
    documents = loader.load()

    if not documents:
        print(f"No .md files found in {DATA_DIR}/")
        return

    print(f"Loaded {len(documents)} document(s)")

    # 3. Attach company name as metadata (derived from filename)
    for doc in documents:
        source_path = Path(doc.metadata.get("source", ""))
        company_name = source_path.stem.lower()  # e.g. "google" from "google.md"
        doc.metadata["company"] = company_name

    # 4. Chunk documents
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n\n##", "\n\n#", "\n\n", "\n", " "]
    )
    chunks = splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks (size=800, overlap=150)")

    # 5. Generate embeddings
    embedding_manager = EmbeddingManager()
    texts = [chunk.page_content for chunk in chunks]
    embeddings = embedding_manager.generate_embeddings(texts)

    # 6. Store in ChromaDB
    vector_store.add_documents(chunks, embeddings)

    print("\nIngestion complete!")
    print(f"Total docs in vector store: {vector_store.collection.count()}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest company docs into RAG vector store")
    parser.add_argument("--clear", action="store_true", help="Clear existing collection before ingesting")
    args = parser.parse_args()
    ingest(clear_first=args.clear)