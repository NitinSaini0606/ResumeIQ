# # import spacy
# # nlp = spacy.load("en_core_web_sm")

# # text = "SpaCy is a powerful library for Natural Language Processing."

# # doc = nlp(text)

# # print("Token\t\tPOS Tag")
# # print("-----------------------")
# # for token in doc:
# #     print(f"{token.text}\t\t{token.pos_}")

# # import spacy
# # nlp = spacy.load("en_core_web_sm")

# # text = ("When Sebastian Thrun started working on self-driving cars at "
# #         "Google in 2007, few people outside of the company took him "
# #         "seriously. “I can tell you very senior CEOs of major American "
# #         "car companies would shake my hand and turn away because I wasn’t "
# #         "worth talking to,” said Thrun, in an interview with Recode earlier "
# #         "this week.")
# # doc = nlp(text)
# # print("Noun phrases:", [chunk.text for chunk in doc.noun_chunks])
# # print("Verbs:", [token.lemma_ for token in doc if token.pos_ == "VERB"])

# # for entity in doc.ents:
# #     print(entity.text, entity.label_)


# # import spacy

# # nlp = spacy.load("en_core_web_lg")  # make sure to use larger package!
# # doc1 = nlp("I like salty fries and hamburgers.")
# # doc2 = nlp("Fast food tastes very good.")

# # # Similarity of two documents
# # print(doc1, "<->", doc2, doc1.similarity(doc2))
# # # Similarity of tokens and spans
# # french_fries = doc1[2:4]
# # burgers = doc1[5]
# # print(french_fries, "<->", burgers, french_fries.similarity(burgers))


# import spacy
# from pathlib import Path

# base_dir = Path(__file__).resolve().parent.parent  
# resume_path = base_dir / "resume.txt"

# with open(resume_path, "r", encoding="utf-8") as file:
#     text = file.read()

# with open(skills_path, "r", encoding="utf-8") as file:
#     skills = file.read()

# nlp = spacy.load("en_core_web_lg")
# resume_doc = nlp(text)

# skills_doc = nlp(skills)
# for token in doc:
#     print(f"{token.text} -> {token.lemma_} -> {token.pos_}")

# skills = []

# for token in doc:
#     if token.pos_ in ["PROPN"]:
#         skills.append(token.lemma_.lower())

# print(skills)

# import spacy 
# from spacy.matcher import PhraseMatcher

# nlp = spacy.load("en_core_web_lg")

# with open("resume.txt", "r", encoding="utf-8") as file:
#     resume_text = file.read()

# with open("skills.txt", "r", encoding="utf-8") as f:
#     skills = [line.strip() for line in f.readlines()]

# resume_doc = nlp(resume_text)

# matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
# patterns = [nlp(skill) for skill in skills if skill]
# matcher.add("SKILLS", patterns)

# matches = matcher(resume_doc)

# extracted_skills = []
# for match_id, start, end in matches:
#     extracted_skills.append(resume_doc[start:end].text.lower())

# print(set(extracted_skills))


# import spacy 
# from spacy.matcher import PhraseMatcher 

# nlp = spacy.load("en_core_web_lg")

# with open("resume.txt", "r", encoding="utf-8") as file:
#     resume_text = file.read()

# resume_doc = nlp(resume_text)

# with open("jd.txt", "r", encoding="utf-8") as f:
#     jd_text = f.read()

# jd_doc = nlp(jd_text)

# matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
# patterns = [nlp(skill) for skill in resume_skills if skill]
# matcher.add("SKILLS", patterns)

# matches = matcher(resume_doc)

# resume_skills = []  
# for match_id, start, end in matches:
#     resume_skills.append(resume_doc[start:end].text.lower())


# jd_skills = []
# for match_id, start, end in matches:
#     jd_skills.append(jd_doc[start:end].text.lower())

# print(set(jd_skills))





# import spacy
# from spacy.matcher import PhraseMatcher

# # Load large model (for future similarity work)
# nlp = spacy.load("en_core_web_lg")

# # -------- Load Resume --------
# with open("resume.txt", "r", encoding="utf-8") as file:
#     resume_text = file.read()
# resume_doc = nlp(resume_text)

# # -------- Load JD --------
# with open("jd.txt", "r", encoding="utf-8") as f:
#     jd_text = f.read()
# jd_doc = nlp(jd_text)

# # -------- Load Skills Database --------
# with open("skills.txt", "r", encoding="utf-8") as file:
#     skills_list = [line.strip().lower() for line in file.readlines() if line.strip()]

# # -------- Create PhraseMatcher --------
# matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
# patterns = [nlp(skill) for skill in skills_list]
# matcher.add("SKILLS", patterns)

# # -------- Extract Resume Skills --------
# resume_matches = matcher(resume_doc)
# resume_skills = set()
# for match_id, start, end in resume_matches:
#     resume_skills.add(resume_doc[start:end].text.lower())

# # -------- Extract JD Skills --------
# jd_matches = matcher(jd_doc)
# jd_skills = set()
# for match_id, start, end in jd_matches:
#     jd_skills.add(jd_doc[start:end].text.lower())

# # -------- Compute Overlap --------
# common_skills = resume_skills.intersection(jd_skills)

# if len(jd_skills) > 0:
#     overlap_score = len(common_skills) / len(jd_skills)
# else:
#     overlap_score = 0

# # -------- Print Results --------
# print("Resume Skills:", resume_skills)
# print("JD Skills:", jd_skills)
# print("Common Skills:", common_skills)
# print("Skill Overlap Score:", round(overlap_score, 2))


import re
import spacy
from spacy.matcher import PhraseMatcher

# Load large model
nlp = spacy.load("en_core_web_lg")


# -------- Skill Aliases Mapping --------
skill_aliases = {
    "nlp": "natural language processing",
    "natural language processing": "natural language processing",
    "ai": "artificial intelligence",
    "artificial intelligence": "artificial intelligence",
    "ml": "machine learning",
    "machine learning": "machine learning",
    "js": "javascript",
    "c++": "c++",
    "c#": "c#",
    "nodejs": "node js",
    "node.js": "node js",
    "rest api": "rest apis",
    "rest api": "rest apis",
    "rest apis": "rest apis",
    "deep learning": "deep learning",
    "dl": "deep learning",
    # add more aliases as needed
}
# -------- Normalize Function --------
def normalize(text):
    text = text.lower()
    text = re.sub(r'[.\-]', ' ', text)   # replace . and - with space
    text = re.sub(r'\s+', ' ', text)      # remove extra spaces
    return text.strip()

def map_aliases(skills_set, alias_dict):
    mapped = set()
    for skill in skills_set:
        skill_lower = skill.lower()
        if skill_lower in alias_dict:
            mapped.add(alias_dict[skill_lower])
        else:
            mapped.add(skill_lower)
    return mapped
# -------- Load Resume --------
with open("testres.txt", "r", encoding="utf-8") as file:
    resume_text = normalize(file.read())  # ✅ normalized
resume_doc = nlp(resume_text)

# -------- Load JD --------
with open("testjd.txt", "r", encoding="utf-8") as f:
    jd_text = normalize(f.read())         # ✅ normalized
jd_doc = nlp(jd_text)

# -------- Load Skills Database --------
with open("skills.txt", "r", encoding="utf-8") as file:
    skills_list = [normalize(line) for line in file.readlines() if line.strip()]  # ✅ normalized

# -------- Create PhraseMatcher --------
matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
patterns = [nlp(skill) for skill in skills_list]
matcher.add("SKILLS", patterns)

# -------- Extract Resume Skills --------
resume_matches = matcher(resume_doc)
resume_skills = set()
for match_id, start, end in resume_matches:
    resume_skills.add(resume_doc[start:end].text.lower())

# -------- Extract JD Skills --------
jd_matches = matcher(jd_doc)
jd_skills = set()
for match_id, start, end in jd_matches:
    jd_skills.add(jd_doc[start:end].text.lower())

# -------- Compute Overlap --------
# common_skills = resume_skills.intersection(jd_skills)

# if len(jd_skills) > 0:
#     overlap_score = len(common_skills) / len(jd_skills)
# else:
#     overlap_score = 0
# -------- Map aliases --------
resume_skills_mapped = map_aliases(resume_skills, skill_aliases)
jd_skills_mapped = map_aliases(jd_skills, skill_aliases)

# -------- Compute Overlap --------
common_skills = resume_skills_mapped.intersection(jd_skills_mapped)
if len(jd_skills_mapped) > 0:
    overlap_score = len(common_skills) / len(jd_skills_mapped)
else:
    overlap_score = 0

# -------- Print Results --------
# print("Resume Skills:", resume_skills)
# print("JD Skills:", jd_skills)
# print("Common Skills:", common_skills)
# print("Skill Overlap Score:", round(overlap_score, 2))

print("Mapped Resume Skills:", resume_skills_mapped)
print("Mapped JD Skills    :", jd_skills_mapped)
print("Common Skills       :", common_skills)
print("Skill Overlap Score :", round(overlap_score, 2))