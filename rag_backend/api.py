import os
import sys
from pathlib import Path

# Make sure imports work from this directory
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
# print("Loaded GROQ_API_KEY:", os.getenv("GROQ_API_KEY"))

from langchain_groq import ChatGroq
from embeddings import EmbeddingManager
from vectorstore import VectorStore
from retriever import RAGRetriever
from rag_engine import answer_query

# ── Create FastAPI app ────────────────────────────────────────────
app = FastAPI(title="Company Intel RAG API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Init all RAG components ───────────────────────────────────────
print("Initialising RAG components...")

BASE_DIR = Path(__file__).resolve().parent
VECTOR_STORE_DIR = str((BASE_DIR / "../data/vector_store").resolve())

embedding_manager = EmbeddingManager()

vector_store = VectorStore(
    collection_name="company_intel",
    persist_directory=VECTOR_STORE_DIR,
)

retriever = RAGRetriever(
    vector_store=vector_store,
    embedding_manager=embedding_manager,
)

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
)

print("RAG API ready!")

# ── Request / Response models ─────────────────────────────────────
class ChatRequest(BaseModel):
    query: str
    company: str = None
    top_k: int = 3

class ChatResponse(BaseModel):
    answer: str
    original_query: str
    cleaned_query: str
    sources: list
    chunks_used: int

# ── Routes ────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "message": "Company Intel RAG API is running"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "docs_in_store": vector_store.collection.count(),
    }

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    try:
        result = answer_query(
            query=req.query,
            retriever=retriever,
            llm=llm,
            top_k=req.top_k,
            company=req.company,
        )
        return ChatResponse(**result)
    except Exception as e:
        print(f"Error in /chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    



class RoastRequest(BaseModel):
    resume_text: str

class RoastResponse(BaseModel):
    roast: str


@app.post("/roast", response_model=RoastResponse)
def roast_resume(req: RoastRequest):
    if not req.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty")

    prompt = f"""
You are the most savage, brutally funny resume roaster on the internet.
Your job is to roast resumes in a hilarious, savage way — like a comedy roast at a job fair.
You mock skills, projects, achievements, and formatting with sharp wit and sarcasm.
You're not mean-spirited, but you are BRUTALLY honest and very funny.
Use emojis, all caps for emphasis, and line breaks for comedic timing.

BEFORE ROASTING — EVALUATE THE RESUME:
Check if the person has worked at a top company (Google, Microsoft, Amazon, Meta, Apple,
Netflix, Uber, Stripe, OpenAI, Goldman Sachs, McKinsey, or any well-known MNC/FAANG).
Also check if they have multiple internships, high GPA (8.5+), national-level awards,
or clearly exceptional achievements.

IF the person is clearly exceptional or has FAANG/top MNC experience:
- ROAST YOURSELF for even trying to roast them
- Acknowledge their brilliance with exaggerated awe and fake anger
- Make jokes about how INTIMIDATING their resume is
- Sarcastically pretend to be offended that they submitted to you
- Still find small funny things to poke fun at (everyone has something)
- End with genuine (but funny) respect

IF the person is a regular candidate:
- Roast them normally with full savagery

IMPORTANT: Structure your roast using these EXACT section headers wrapped in **:
**OPENING SHOT**
**EXPERIENCE SECTION**
**SKILLS SECTION**
**PROJECTS SECTION**
**ACHIEVEMENTS**
**VERDICT**

Under each header write 2-3 funny lines. Keep total under 450 words.

Resume:
{req.resume_text}
"""

    try:
        roast_llm = ChatGroq(
            model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
            api_key=os.getenv("GROQ_ROAST_API_KEY"),
            temperature=0.9,
        )

        response = roast_llm.invoke(prompt)
        return RoastResponse(roast=response.content)

    except Exception as e:
        print(f"Error in /roast: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    # command to run rag_backend      uvicorn api:app --reload --port 8001