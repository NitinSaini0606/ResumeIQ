from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os, sys

sys.path.append(os.path.dirname(__file__))
from predict import predict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchRequest(BaseModel):
    resume_text: str
    jd_text: str
    experience: int = 0

@app.post("/predict")
def match_resume(req: MatchRequest):

    base = os.path.join(os.path.dirname(__file__), '..', 'data')

    # write resume to temp file
    temp_resume = os.path.join(base, 'resumes', '_temp_resume.txt')
    with open(temp_resume, 'w', encoding='utf-8') as f:
        f.write(req.resume_text)

    # write JD to temp file
    temp_jd = os.path.join(base, 'jds', '_temp_jd.txt')
    with open(temp_jd, 'w', encoding='utf-8') as f:
        f.write(req.jd_text)

    result = predict(temp_resume, temp_jd, req.experience)
    return result

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)