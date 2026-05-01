# 🚀 ResumeIQ — AI-Powered Resume Intelligence Platform

ResumeIQ is a full-stack AI-powered career intelligence platform that analyzes resumes against job descriptions, provides actionable insights, and helps users understand their readiness for specific roles.

It combines **Machine Learning, NLP, Retrieval-Augmented Generation (RAG), and LLMs** to solve real-world hiring problems.



---

## ✨ Features

### 📊 Resume Matcher

A system that evaluates how well a resume matches a job description.

#### Key Capabilities
- Match score (0–100)
- Skill gap analysis
- Matched / Missing / Extra skills detection
- Domain mismatch detection
- Actionable improvement suggestions

#### Approach
- Keyword and skill matching
- POS-based text analysis
- Semantic similarity
- Logistic Regression model for scoring

---

### 🤖 Company Intel Chatbot

A RAG-based chatbot that answers company-specific hiring queries.

#### Example Queries
- What DSA topics are asked at Stripe?
- What is the interview process at Google?
- How important is the behavioral round at Meta?

#### How It Works
1. Company data is stored in markdown files.
2. Text is split into chunks.
3. Chunks are converted into embeddings.
4. Embeddings are stored in ChromaDB.
5. Relevant chunks are retrieved for a user query.
6. Groq LLaMA generates grounded answers using retrieved context.

---

### 😈 Resume Roast

A creative LLM-powered feature that humorously critiques resumes.

#### Features
- Structured roast output
- Uses Groq + LLaMA 3
- Detects strong profiles such as FAANG / top-company experience
- Switches to self-roast mode for exceptional resumes
- Interactive animated UI display

---

## 🧠 Tech Stack

| Category | Tools / Technologies |
|---|---|
| Frontend | React.js, Vite, HTML, CSS |
| Backend | FastAPI, Python |
| Machine Learning | Logistic Regression |
| NLP | Keyword Matching, POS Analysis, Semantic Similarity |
| RAG | ChromaDB, Vector Embeddings, Retrieval |
| LLM | Groq API, LLaMA 3.1 |
| Tools | Git, GitHub, Postman, VS Code |

---

## 🏗️ System Architecture

```txt
User Input
   ↓
React Frontend
   ↓
FastAPI Backend
   ↓
├── Resume Matcher
│   ├── Resume + Job Description Input
│   ├── NLP Feature Extraction
│   ├── ML-Based Scoring
│   └── Match Result + Skill Gap Insights
│
├── Company Intel Chatbot
│   ├── Query Preprocessing
│   ├── ChromaDB Vector Retrieval
│   ├── Context Selection
│   └── LLM-Based Answer Generation
│
└── Resume Roast
    ├── Resume Text Input
    ├── Prompt Engineering
    └── LLM-Generated Roast Output
```

---

## 📁 Project Structure

```txt
ResumeIQ/
├── Ui/                # React frontend
├── scripts/           # Resume matcher backend
├── rag_backend/       # RAG chatbot + resume roast backend
├── data/              # Company data, resumes, job descriptions
├── skills.txt         # Skills vocabulary
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/NitinSaini0606/ResumeIQ.git
cd ResumeIQ
```

### 2. Start Resume Matcher Backend

```bash
cd scripts
pip install -r requirements.txt
uvicorn api:app --reload --port 8000
```

### 3. Start RAG + Resume Roast Backend

Open a new terminal:

```bash
cd rag_backend
pip install -r requirements.txt
uvicorn api:app --reload --port 8001
```

### 4. Start Frontend

Open a new terminal:

```bash
cd Ui
npm install
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `rag_backend/` folder:

```env
GROQ_API_KEY=your_api_key_here
GROQ_ROAST_API_KEY=your_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```


---

## 🧪 API Endpoints

### Resume Matcher

```http
POST /predict
```

Sample request:

```json
{
  "resume_text": "Your resume text here",
  "jd_text": "Job description text here",
  "experience": 0
}
```

---

### Company Intel Chatbot

```http
POST /chat
```

Sample request:

```json
{
  "query": "What DSA topics are important for Stripe?",
  "company": "stripe",
  "top_k": 3
}
```

---

### Resume Roast

```http
POST /roast
```

Sample request:

```json
{
  "resume_text": "Your resume text here"
}
```

---

## 🧩 Company Knowledge Base

The chatbot uses company-specific markdown files stored in:

```txt
data/companies/
```

### Supported Companies

- Google
- Microsoft
- Meta
- Amazon
- Apple
- Flipkart
- Stripe
- OpenAI

---

## 🔄 RAG Ingestion

Build or update the vector database:

```bash
cd rag_backend
python ingest.py
```

Rebuild from scratch:

```bash
python ingest.py --clear
```

---

## 📌 Current Status

- Resume Matcher backend runs locally.
- RAG + Resume Roast backend runs locally.
- Frontend runs locally with Vite.
- Deployment optimization is in progress.








