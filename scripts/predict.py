
import os
import sys
import joblib
import pandas as pd
sys.path.append(os.path.dirname(__file__))
from sbertandspacyscoring import compute_scores


output_dir = os.path.join(os.path.dirname(__file__), '..', 'output')
model  = joblib.load(os.path.join(output_dir, 'model.pkl'))
scaler = joblib.load(os.path.join(output_dir, 'scaler.pkl'))
print("✅ Model and scaler loaded!")


def load_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def analyze_skills(resume_text, jd_text, skills_file):

    with open(skills_file, 'r', encoding='utf-8') as f:
        skills = [line.strip().lower() for line in f if line.strip()]

    resume_lower = resume_text.lower()
    jd_lower     = jd_text.lower()

    jd_skills     = set()
    resume_skills = set()

    for skill in skills:
        if skill in jd_lower:
            jd_skills.add(skill)
        if skill in resume_lower:
            resume_skills.add(skill)

    common  = resume_skills & jd_skills   
    missing = jd_skills - resume_skills   
    extra   = resume_skills - jd_skills   

    return {
        "jd_skills":     sorted(jd_skills),
        "resume_skills": sorted(resume_skills),
        "common":        sorted(common),
        "missing":       sorted(missing),
        "extra":         sorted(extra)
    }

def predict(resume_path, jd_path, experience=0):


    resume_text = load_text(resume_path)
    jd_text     = load_text(jd_path)
    print(f"\nResume : {os.path.basename(resume_path)}")
    print(f"JD     : {os.path.basename(jd_path)}")


    results = compute_scores(
        clean_resume=resume_text,
        clean_jd=jd_text,
        skills_list_or_file=os.path.join(
            os.path.dirname(__file__), '..', 'skills.txt')
    )

    skill_overlap = results['spacy_score']
    pos_score     = results['pos_score']
    sbert_score   = results['sbert_score']

    print(f"\n----- SCORES -----")
    print(f"Skill Overlap  : {skill_overlap}")
    print(f"POS Score      : {pos_score}")
    print(f"SBERT Score    : {sbert_score}")
    print(f"Experience     : {experience}")



    skills_file  = os.path.join(
                   os.path.dirname(__file__), '..', 'skills.txt')
    skill_data   = analyze_skills(resume_text, jd_text, skills_file)

    print(f"\n--SKILL ANALYSIS --")
    print(f"JD requires    : {len(skill_data['jd_skills'])} skills")
    print(f"Resume has     : {len(skill_data['resume_skills'])} skills")
    print(f"Common         : {len(skill_data['common'])} skills")
    print(f"Missing        : {len(skill_data['missing'])} skills")

    print(f"\n Common Skills ({len(skill_data['common'])}):")
    for s in skill_data['common']:
        print(f"   • {s}")
    print(f"\n❌ Missing Skills ({len(skill_data['missing'])}):")
    for s in skill_data['missing']:
        print(f"   • {s}")
    print(f"\n➕ Extra Skills in Resume ({len(skill_data['extra'])}):")
    for s in skill_data['extra']:
        print(f"   • {s}")

    exp_flag = -1 if experience < 0 else (0 if experience == 0 else 1)
    print(f"Exp Flag       : {exp_flag}")

    
    features = pd.DataFrame([[skill_overlap, pos_score, 
                            sbert_score, experience, exp_flag]],
                columns=['skill_overlap', 'pos_score', 
                        'sbert_score', 'experience', 'exp_flag'])
    scaled   = scaler.transform(features)
    z = model.decision_function(scaled)[0]
    probability = model.predict_proba(scaled)[0][1]
    label = model.predict(scaled)[0]


    print(f"\n----- MODEL OUTPUT -----")
    print(f"Z value        : {round(float(z), 4)}")
    print(f"Sigmoid(Z)     : {round(probability, 4)}  ← this is probability")
    print(f"Threshold      : 0.70")
    print(f"Probability    : {round(probability * 100, 1)}%")
    print(f"\nFinal Score    : {round(probability*100, 4)}")
    print(f"Prediction     : {'✅ GOOD MATCH' if label == 1 else '❌ BAD MATCH'}")

    # Step 7 — Confidence level
    if probability >= 0.80:
        confidence = "🟢 HIGH confidence"
    elif probability >= 0.65:
        confidence = "🟡 MEDIUM confidence"
    elif probability >= 0.50:
        confidence = "🟠 LOW confidence — borderline"
    else:
        confidence = "🔴 BAD MATCH"
    print(f"Confidence     : {confidence}")

    return {
        "resume":       os.path.basename(resume_path),
        "jd":           os.path.basename(jd_path),
        "skill_overlap": skill_overlap,
        "pos_score":    pos_score,
        "sbert_score":  sbert_score,
        "experience":   experience,
        "exp_flag":     exp_flag,
        "z_value":      round(float(z), 4),
        "probability":  round(probability, 4),
        "label":        int(label),
        "confidence":   confidence,

        "common_skills":   skill_data['common'],
        "missing_skills":  skill_data['missing'],
        "extra_skills":    skill_data['extra'],
        "jd_skill_count":  len(skill_data['jd_skills']),
        "resume_skill_count": len(skill_data['resume_skills'])
    }


if __name__ == "__main__":

    resume_path  = os.path.join(os.path.dirname(__file__), 
                   '..', 'data', 'resumes', 'resume_43.txt')
    jd_path      = os.path.join(os.path.dirname(__file__), 
                   '..', 'data', 'jds', 'jdfullStack.txt')
    experience   = 0    #resume_exp - jd_required_exp

    result = predict(resume_path, jd_path, experience)


