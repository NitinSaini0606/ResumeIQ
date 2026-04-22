from scripts.preprocess import preprocess_resume, preprocess_jd
from scripts.sbertandspacyscoring import compute_scores
import csv
import os

def save_to_csv(data: dict, filepath="scripts/scores.csv"):
    file_exists = os.path.exists(filepath)
    
    with open(filepath, mode='a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=data.keys())
        
        if not file_exists:
            writer.writeheader()
        
        writer.writerow(data)

def main():
    resume_path = "data/resumes/resume_54.txt"
    jd_path     = "data/jds/jdfullStack.txt"

    print(f"Using resume file: {resume_path}")
    print(f"Using JD file    : {jd_path}")
    if os.path.exists(resume_path):
        print(f"Resume file size : {os.path.getsize(resume_path)} bytes")
    if os.path.exists(jd_path):
        print(f"JD file size     : {os.path.getsize(jd_path)} bytes")
    

    with open(resume_path, "r", encoding="utf-8") as f:
        raw_resume = f.read()

    with open(jd_path, "r", encoding="utf-8") as f:
        raw_jd = f.read()

    if not raw_resume.strip():
        raise ValueError(f"Resume file is empty: {resume_path}")
    if not raw_jd.strip():
        raise ValueError(f"JD file is empty: {jd_path}")

    with open("skills.txt", "r", encoding="utf-8") as f:
        skills_list = [line.strip().lower() for line in f if line.strip()]

    # -------- Preprocess --------
    clean_resume = preprocess_resume(raw_resume)
    clean_jd = preprocess_jd(raw_jd)

    # -------- Compute Scores --------
    results = compute_scores(clean_resume, clean_jd, skills_list)

    print("========== PREPROCESSED DATA ==========")
    print(f"Clean Resume:\n{clean_resume}\n")
    print(f"Clean JD:\n{clean_jd}\n")
    print("======================================\n")


    print("========== RESULTS ==========")

    print("\n----- SKILL MATCHING -----")
    print(f"Resume Skills     : {results['resume_skills']}")
    print(f"JD Skills         : {results['jd_skills']}")
    print(f"Common Skills     : {results['common_skills']}")
    print(f"Skill Overlap     : {results['spacy_score']:.4f}")

    print("\n----- POS KEYWORD MATCHING -----")
    print(f"Resume Keywords   : {results['resume_keywords']}")
    print(f"JD Keywords       : {results['jd_keywords']}")
    print(f"Common Keywords   : {results['common_keywords']}")
    print(f"POS Overlap Score : {results['pos_score']:.4f}")

    print("\n----- SEMANTIC MATCHING -----")
    print(f"SBERT Score       : {results['sbert_score']:.4f}")

    print("\n----- FINAL SCORE -----")
    print(f"Final Score       : {results['final_score']:.4f}")

    print("===============================")

    scores = {
        "resume_file":     os.path.basename(resume_path),
        "jd_file":         os.path.basename(jd_path),   
        "spacy_score":     round(results['spacy_score'], 4),
        "pos_score":       round(results['pos_score'], 4),
        "sbert_score":     round(results['sbert_score'], 4),
        "final_score":     round(results['final_score'], 4),
        "experience":      0,
        "label":           1             
    }

    save_to_csv(scores)
    
if __name__ == "__main__":
    main()