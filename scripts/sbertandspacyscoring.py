# # -------- Imports --------
# import os
# import re
# import logging
# import torch
# import spacy
# from spacy.matcher import PhraseMatcher
# from sentence_transformers import SentenceTransformer, util

# # -------- Silence Logs --------
# os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
# os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
# logging.getLogger("transformers").setLevel(logging.ERROR)
# logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
# logging.getLogger("huggingface_hub").setLevel(logging.ERROR)

# # -------- Load Models --------
# nlp = spacy.load("en_core_web_lg")
# model = SentenceTransformer('all-mpnet-base-v2')

# # -------- Helper Functions --------
# def normalize(text):
#     text = text.lower()
#     text = re.sub(r'[.\-]', ' ', text)
#     text = re.sub(r'\s+', ' ', text)
#     return text.strip()

# def encode_max_pooling(text, chunk_size=200):
#     words = text.split()
#     chunks = [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
#     embeddings = model.encode(chunks, convert_to_tensor=True)
#     return torch.mean(embeddings, dim=0)

# # -------- Load Files --------
# with open("testres.txt", "r", encoding="utf-8") as f:
#     raw_resume = f.read()

# with open("testjd.txt", "r", encoding="utf-8") as f:
#     raw_jd = f.read()

# with open("skills.txt", "r", encoding="utf-8") as f:
#     skills_list = [normalize(line) for line in f.readlines() if line.strip()]

# # ================================================
# # PART 1 — spaCy Skill Overlap Score
# # ================================================

# resume_doc = nlp(normalize(raw_resume))
# jd_doc = nlp(normalize(raw_jd))

# matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
# matcher.add("SKILLS", [nlp(skill) for skill in skills_list])

# resume_skills = set(resume_doc[s:e].text.lower() for _, s, e in matcher(resume_doc))
# jd_skills = set(jd_doc[s:e].text.lower() for _, s, e in matcher(jd_doc))
# common_skills = resume_skills.intersection(jd_skills)

# spacy_score = len(common_skills) / len(jd_skills) if jd_skills else 0

# # ================================================
# # PART 2 — SBERT Semantic Score
# # ================================================

# resume_embedding = encode_max_pooling(raw_resume)
# jd_embedding = encode_max_pooling(raw_jd)

# sbert_score = float(util.cos_sim(resume_embedding, jd_embedding))

# # ================================================
# # FINAL COMBINED SCORE
# # ================================================

# final_score = (spacy_score * 0.6) + (sbert_score * 0.4)

# print("========== RESULTS ==========")
# print(f"Resume Skills      : {resume_skills}")
# print(f"JD Skills          : {jd_skills}")
# print(f"Common Skills      : {common_skills}")
# print(f"\nspaCy Score        : {round(spacy_score, 4)}")
# print(f"SBERT Score        : {round(sbert_score, 4)}")
# print(f"Final Score        : {round(final_score, 4)}")
# print("==============================")




# -------- Imports --------
# import os
# import re
# import logging
# import torch
# import spacy
# from spacy.matcher import PhraseMatcher
# from sentence_transformers import SentenceTransformer, util


# os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
# os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
# logging.getLogger("transformers").setLevel(logging.ERROR)
# logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
# logging.getLogger("huggingface_hub").setLevel(logging.ERROR)

# nlp = spacy.load("en_core_web_lg")
# model = SentenceTransformer("all-mpnet-base-v2")
# # model = SentenceTransformer("paraphrase-mpnet-base-v2")


# # =========================================================
# # Helper Functions
# # =========================================================

# skill_aliases = {
#     # Programming
#     "python": "python",
#     "java": "java",
#     "javascript": "javascript",
#     "js": "javascript",
#     "typescript": "typescript",
#     "c": "c",
#     "c++": "c++",
#     "c#": "c#",
#     "go": "go",
#     "golang": "go",
#     "rust": "rust",
#     "swift": "swift",
#     "kotlin": "kotlin",
#     "dart": "dart",
#     "r": "r",
#     "matlab": "matlab",
#     "scala": "scala",
#     "perl": "perl",
#     "php": "php",
#     "ruby": "ruby",
#     "solidity": "solidity",
#     "assembly": "assembly",

#     # Frontend
#     "reactjs": "react",
#     "react": "react",
#     "react native": "react native",
#     "next.js": "next.js",
#     "angular": "angular",
#     "vue": "vue",
#     "nuxt.js": "nuxt.js",
#     "tailwind css": "tailwind css",
#     "bootstrap": "bootstrap",
#     "html": "html",
#     "css": "css",
#     "sass": "sass",

#     # Backend
#     "nodejs": "node js",
#     "node.js": "node js",
#     "node js": "node js",
#     "express": "express",
#     "flask": "flask",
#     "django": "django",
#     "fastapi": "fastapi",
#     "spring boot": "spring boot",
#     "asp.net": "asp.net",
#     "laravel": "laravel",
#     "ruby on rails": "ruby on rails",
#     "rest api": "rest apis",
#     "rest apis": "rest apis",
#     "soap": "soap",
#     "graphql": "graphql",
#     "websocket": "websocket",

#     # AI / ML
#     "machine learning": "machine learning",
#     "ml": "machine learning",
#     "deep learning": "deep learning",
#     "dl": "deep learning",
#     "artificial intelligence": "artificial intelligence",
#     "ai": "artificial intelligence",
#     "nlp": "natural language processing",
#     "natural language processing": "natural language processing",
#     "computer vision": "computer vision",
#     "reinforcement learning": "reinforcement learning",
#     "large language models": "large language models",
#     "llm": "large language models",
#     "generative ai": "generative ai",
#     "prompt engineering": "prompt engineering",

#     # Libraries / Frameworks
#     "tensorflow": "tensorflow",
#     "pytorch": "pytorch",
#     "scikit-learn": "scikit-learn",
#     "keras": "keras",
#     "opencv": "opencv",
#     "hugging face": "hugging face",
#     "transformers": "transformers",
#     "pandas": "pandas",
#     "numpy": "numpy",
#     "matplotlib": "matplotlib",
#     "seaborn": "seaborn",
#     "plotly": "plotly",
#     "scipy": "scipy",

#     # Databases
#     "sql": "sql",
#     "mysql": "mysql",
#     "postgresql": "postgresql",
#     "mongodb": "mongodb",
#     "redis": "redis",
#     "elasticsearch": "elasticsearch",
#     "firebase": "firebase",
#     "sqlite": "sqlite",
#     "oracle": "oracle",
#     "cassandra": "cassandra",
#     "dynamodb": "dynamodb",
#     "neo4j": "neo4j",
#     "mariadb": "mariadb",

#     # Tools / DevOps / Cloud
#     "git": "git",
#     "docker": "docker",
#     "kubernetes": "kubernetes",
#     "jenkins": "jenkins",
#     "ci/cd": "ci/cd",
#     "github actions": "github actions",
#     "gitlab ci": "gitlab ci",
#     "terraform": "terraform",
#     "ansible": "ansible",
#     "aws": "aws",
#     "azure": "azure",
#     "google cloud": "gcp",
#     "gcp": "gcp",
#     "linux": "linux",
#     "bash": "bash",
#     "shell scripting": "shell scripting",
#     "nginx": "nginx",
#     "apache": "apache",
#     "microservices": "microservices",
#     "devops": "devops",
#     "mlops": "mlops",
#     "data engineering": "data engineering",
#     "etl": "etl",
#     "apache spark": "apache spark",
#     "hadoop": "hadoop",
#     "kafka": "kafka",
#     "airflow": "airflow",
#     "dbt": "dbt",
#     "snowflake": "snowflake",
#     "databricks": "databricks",
#     "power bi": "power bi",
#     "tableau": "tableau",
#     "excel": "excel",

#     # Testing / QA
#     "selenium": "selenium",
#     "pytest": "pytest",
#     "junit": "junit",
#     "postman": "postman",
#     "swagger": "swagger",

#     "nextjs": "next.js",
#     "material ui": "material ui",
#     "chakra ui": "chakra ui",
#     "redux": "redux",
#     "mobx": "mobx",
#     "react-router": "react-router",
#     "scss": "sass",
    
#     # Backend / Cloud / API
#     "grpc": "grpc",
#     "rabbitmq": "rabbitmq",
#     "celery": "celery",
    
#     # AI / ML / NLP
#     "bert": "bert",
#     "minibert": "bert",
#     "distilbert": "bert",
#     "cnn": "cnn",
#     "bilstm": "bilstm",
    
#     # Tools / IDE
#     "vs code": "vscode",
#     "vscode": "vscode",
#     "intellij": "intellij",
#     "docker-compose": "docker-compose",
#     "circleci": "circleci",
    
#     # CS Fundamentals
#     "algorithm": "data structures & algorithms",
#     "design patterns": "design patterns",

#     # CS Fundamentals
#     "dsa": "data structures & algorithms",
#     "data structures & algorithms": "data structures & algorithms",
#     "data structures": "data structures & algorithms",
#     "oop": "oop",
#     "object-oriented programming": "oop",
#     "dbms": "dbms",
#     "operating systems": "operating systems",
#     "os": "operating systems",
#     "computer networks": "computer networks",
#     "oop": "object-oriented programming",
#     "ds": "data structures",
#     "dsa": "data structures & algorithms",
#     "react": "reactjs"
# }


# def map_aliases(skills_set, alias_dict):
#     mapped = set()
#     for skill in skills_set:
#         skill_lower = skill.lower()
#         if skill_lower in alias_dict:
#             mapped.add(alias_dict[skill_lower])
#         else:
#             mapped.add(skill_lower)
#     return mapped

# def normalize(text: str) -> str:
#     text = text.lower()
#     text = re.sub(r"[.\-]", " ", text)
#     text = re.sub(r"\s+", " ", text)
#     return text.strip()


# def encode_max_pooling(text: str, chunk_size: int = 200):
#     words = text.split()
#     chunks = [
#         " ".join(words[i:i + chunk_size])
#         for i in range(0, len(words), chunk_size)
#     ]

#     embeddings = model.encode(chunks, convert_to_tensor=True)
#     return torch.mean(embeddings, dim=0)



# # =========================================================
# # Main Scoring Function
# # =========================================================

# def compute_scores(clean_resume: str, clean_jd: str, skills_list: list):

#     # -------- spaCy Skill Overlap --------
#     resume_doc = nlp(normalize(clean_resume))
#     jd_doc = nlp(normalize(clean_jd))

#     matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
#     matcher.add("SKILLS", [nlp(skill) for skill in skills_list])

#     resume_skills = {
#         resume_doc[start:end].text.lower()
#         for _, start, end in matcher(resume_doc)
#     }

#     jd_skills = {
#         jd_doc[start:end].text.lower()
#         for _, start, end in matcher(jd_doc)
#     }


#     resume_skills_mapped = map_aliases(resume_skills, skill_aliases)
#     jd_skills_mapped = map_aliases(jd_skills, skill_aliases)
#     common_skills = resume_skills_mapped.intersection(jd_skills_mapped)
#     spacy_score = len(common_skills) / len(jd_skills_mapped) if jd_skills_mapped else 0.0



#     # -------- POS Keyword Match ---------------
#     resume_keywords = {
#         token.lemma_.lower()
#         for token in resume_doc
#         if token.pos_ in ["NOUN", "PROPN"]
#         and not token.is_stop
#         and token.is_alpha
#         and len(token.text) > 2
#     }

#     jd_keywords = {
#         token.lemma_.lower()
#         for token in jd_doc
#         if token.pos_ in ["NOUN", "PROPN"]
#         and not token.is_stop
#         and token.is_alpha
#         and len(token.text) > 2
#     }

#     common_keywords = resume_keywords.intersection(jd_keywords)

#     pos_score = (
#         len(common_keywords) / len(jd_keywords)
#         if jd_keywords else 0.0
#     )
#     # -------- SBERT Semantic Similarity --------
#     resume_embedding = encode_max_pooling(clean_resume)
#     jd_embedding = encode_max_pooling(clean_jd)

#     sbert_score = float(util.cos_sim(resume_embedding, jd_embedding))


#     # -------- Final Weighted Score --------
#     # final_score = (spacy_score * 0.6) + (sbert_score * 0.4)
#     final_score = (
#         spacy_score * 0.5 +
#         sbert_score * 0.3 +
#         pos_score * 0.2
#     )


#     return {
#         "resume_skills": resume_skills_mapped,
#         "jd_skills": jd_skills_mapped,
#         "common_skills": common_skills,
#         "spacy_score": round(spacy_score, 4),
#         "resume_keywords": resume_keywords,
#         "jd_keywords": jd_keywords,
#         "common_keywords": common_keywords,
#         "pos_score": round(pos_score, 4),
#         "sbert_score": round(sbert_score, 4),
#         "final_score": round(final_score, 4),
#     }






















# import os
# import re
# import logging
# import torch
# import spacy
# from spacy.matcher import PhraseMatcher
# from sentence_transformers import SentenceTransformer, util

# # =========================================================
# # Environment & Logging
# # =========================================================
# os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
# os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
# logging.getLogger("transformers").setLevel(logging.ERROR)
# logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
# logging.getLogger("huggingface_hub").setLevel(logging.ERROR)

# nlp = spacy.load("en_core_web_lg")
# model = SentenceTransformer("all-mpnet-base-v2")

# # =========================================================
# # Skill Aliases
# # =========================================================
# skill_aliases = {

#     "dsa": "data structures and algorithms",
#     "data structures and algorithms": "data structures and algorithms",
#     "data structures & algorithms": "data structures and algorithms",
#     "data structures and algorithms (dsa)": "data structures and algorithms",
#     "data structures": "data structures and algorithms",
#     "ds": "data structures and algorithms",

#     # Programming
#     "python": "python",
#     "java": "java",
#     "javascript": "javascript",
#     "js": "javascript",
#     "typescript": "typescript",
#     "c": "c",
#     "c++": "c++",
#     "c#": "c#",
#     "go": "go",
#     "golang": "go",
#     "rust": "rust",
#     "swift": "swift",
#     "kotlin": "kotlin",
#     "dart": "dart",
#     "r": "r",
#     "matlab": "matlab",
#     "scala": "scala",
#     "perl": "perl",
#     "php": "php",
#     "ruby": "ruby",
#     "solidity": "solidity",
#     "assembly": "assembly",
#     # Frontend
#     "react": "react",
#     "reactjs": "react",
#     "react native": "react native",
#     "next.js": "next.js",
#     "nextjs": "next.js",
#     "angular": "angular",
#     "vue": "vue",
#     "nuxt.js": "nuxt.js",
#     "tailwind css": "tailwind css",
#     "bootstrap": "bootstrap",
#     "html": "html",
#     "css": "css",
#     "sass": "sass",
#     "scss": "sass",
#     # Backend
#     "nodejs": "node js",
#     "node.js": "node js",
#     "node js": "node js",
#     "express": "express",
#     "flask": "flask",
#     "django": "django",
#     "fastapi": "fastapi",
#     "spring boot": "spring boot",
#     "asp.net": "asp.net",
#     "laravel": "laravel",
#     "ruby on rails": "ruby on rails",
#     "rest api": "rest apis",
#     "rest apis": "rest apis",
#     "soap": "soap",
#     "graphql": "graphql",
#     "websocket": "websocket",
#     "PostgreSQL":"postgresql",
#     "postgresql" : "postgresql",
#     # AI / ML
#     "machine learning": "machine learning",
#     "ml": "machine learning",
#     "deep learning": "deep learning",
#     "dl": "deep learning",
#     "artificial intelligence": "artificial intelligence",
#     "ai": "artificial intelligence",
#     "nlp": "natural language processing",
#     "natural language processing": "natural language processing",
#     "computer vision": "computer vision",
#     "reinforcement learning": "reinforcement learning",
#     "large language models": "large language models",
#     "llm": "large language models",
#     "generative ai": "generative ai",
#     "Gen AI" : "generative ai",
#     "prompt engineering": "prompt engineering",
#     # CS Fundamentals
#     "dsa": "data structures & algorithms",
#     "data structures & algorithms": "data structures & algorithms",
#     "DSA" : "data structures & algorithms",
#     "data structures": "data structures & algorithms",
#     "ds": "data structures & algorithms",
#     "oop": "oop",
#     "object-oriented programming": "oop",
#     "design patterns": "design patterns",
#     "object oriented programming": "oop",
#     "object oriented programming": "oop",   
#     "object-oriented programming": "oop",  
#     "oop": "oop",
#     "Database Management Systems (DBMS)" : "dbms",
#     "DBMS":"dbms",
#     "dbms":"dbms",
#     "Database Management Systems" : "dbms",
#     "database management systems" : "dbms",
#     "Database management systems" : "dbms",
#     "operating systems": "operating systems",
#     "os": "operating systems",
#     "Operating Systems" : "operating systems",
#     "RAG": "RAG (retrieval-augmented generation)",
#     "RAG (retrieval-augmented generation)" : "RAG (retrieval-augmented generation)",



# }

# # =========================================================
# # Helper Functions
# # =========================================================
# # def normalize_text(text: str) -> str:
# #     text = text.lower()
# #     text = re.sub(r"[.\-]", " ", text)  # dots & dashes
# #     text = re.sub(r"&", " and ", text)  # replace & with "and"
# #     text = re.sub(r"\s+", " ", text)    # collapse spaces
# #     return text.strip()

# def normalize_text(text: str) -> str:
#     text = text.lower()
#     text = re.sub(r"[.\-]", " ", text)   # dots & dashes → space
#     text = re.sub(r"&", "and", text)      # & → and (no spaces around)
#     text = re.sub(r"\s+", " ", text)      # collapse spaces
#     return text.strip()


# def map_aliases(skills_set, alias_dict):
#     mapped = set()
#     for skill in skills_set:
#         skill_norm = normalize_text(skill)
#         mapped.add(alias_dict.get(skill_norm, skill_norm))
#     return mapped


# def encode_max_pooling(text: str, chunk_size: int = 200):
#     words = text.split()
#     chunks = [" ".join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]
#     embeddings = model.encode(chunks, convert_to_tensor=True)
#     return torch.mean(embeddings, dim=0)


# def load_skills(file_path: str) -> list:
#     """Load skills from a txt file and normalize them"""
#     skills = []
#     with open(file_path, "r", encoding="utf-8") as f:
#         for line in f:
#             skill = line.strip()
#             if skill:
#                 skills.append(skill)
#     # Normalize and map aliases
#     skills = [normalize_text(s) for s in skills]
#     # skills = map_aliases(skills, skill_aliases)
#     return sorted(list(set(skills)))


# # =========================================================
# # Main Scoring Function
# # =========================================================
# def compute_scores(
#     clean_resume: str,
#     clean_jd: str,
#     skills_list_or_file: str | list = "skills.txt",
   
# ):
#     if isinstance(skills_list_or_file, list):
#         skills_list = [normalize_text(s) for s in skills_list_or_file if str(s).strip()]
#         skills_list = sorted(list(map_aliases(set(skills_list), skill_aliases)))
#     else:
#         skills_list = load_skills(skills_list_or_file)
#     print("DEBUG:", [s for s in skills_list if "object" in s or "design" in s or "oop" in s])
#     # spaCy docs
#     resume_doc = nlp(normalize_text(clean_resume))
#     jd_doc = nlp(normalize_text(clean_jd))

#     # PhraseMatcher
#     matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
#     matcher.add("SKILLS", [nlp(skill) for skill in skills_list])

#     # Extract skills
#     resume_skills = {resume_doc[start:end].text for _, start, end in matcher(resume_doc)}
#     jd_skills = {jd_doc[start:end].text for _, start, end in matcher(jd_doc)}

#     # Map aliases
#     resume_skills_mapped = map_aliases(resume_skills, skill_aliases)
#     jd_skills_mapped = map_aliases(jd_skills, skill_aliases)
#     common_skills = resume_skills_mapped.intersection(jd_skills_mapped)
#     spacy_score = len(common_skills) / len(jd_skills_mapped) if jd_skills_mapped else 0.0

#     # POS-based keyword matching
#     resume_keywords = {token.lemma_.lower() for token in resume_doc
#                        if token.pos_ in ["NOUN", "PROPN"] and token.is_alpha and not token.is_stop and len(token.text) > 2}
#     jd_keywords = {token.lemma_.lower() for token in jd_doc
#                    if token.pos_ in ["NOUN", "PROPN"] and token.is_alpha and not token.is_stop and len(token.text) > 2}
#     common_keywords = resume_keywords.intersection(jd_keywords)
#     pos_score = len(common_keywords) / len(jd_keywords) if jd_keywords else 0.0

#     # SBERT similarity
#     resume_embedding = encode_max_pooling(clean_resume)
#     jd_embedding = encode_max_pooling(clean_jd)
#     sbert_score = float(util.cos_sim(resume_embedding, jd_embedding))

#     # Final weighted score
#     final_score = spacy_score * 0.5 + sbert_score * 0.3 + pos_score * 0.2

#     return {
#         "resume_skills": resume_skills_mapped,
#         "jd_skills": jd_skills_mapped,
#         "common_skills": common_skills,
#         "spacy_score": round(spacy_score, 4),
#         "resume_keywords": resume_keywords,
#         "jd_keywords": jd_keywords,
#         "common_keywords": common_keywords,
#         "pos_score": round(pos_score, 4),
#         "sbert_score": round(sbert_score, 4),
#         "final_score": round(final_score, 4),
#     }



import os
import re
import logging
import torch
import spacy
from spacy.matcher import PhraseMatcher
from sentence_transformers import SentenceTransformer, util

os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)

nlp = spacy.load("en_core_web_lg")
_sbert_model = None


def _get_sbert_model():
    """Lazy-load SentenceTransformer to avoid httpx client issues at import time."""
    global _sbert_model
    if _sbert_model is None:
        _sbert_model = SentenceTransformer("all-mpnet-base-v2")
    return _sbert_model

# normalize_text — applied to ALL text and ALL keys before lookup
# Rule: lowercase, dots/dashes → space, & → and, collapse spaces

def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[.\-]", " ", text)       
    text = re.sub(r"&", " and ", text)        
    text = re.sub(r"\s+", " ", text)          
    return text.strip()

skill_aliases = {
    # --- DSA ---
    "dsa":                                      "data structures and algorithms",
    "data structures and algorithms":           "data structures and algorithms",
    "data structures and algorithms (dsa)":     "data structures and algorithms",
    "data structures":                          "data structures and algorithms",

    # --- OOP ---
    "oop":                                      "oop",
    "object oriented programming":             "oop",
    "object oriented programming (oop)":       "oop",

    # --- Design Patterns ---
    "design patterns":                          "design patterns",

    # --- DBMS ---
    "dbms":                                     "dbms",
    "database management systems":             "dbms",
    "database management systems (dbms)":      "dbms",

    # --- Operating Systems ---
    "operating systems":                        "operating systems",
    "os":                                       "operating systems",

    # --- Computer Networks ---
    "computer networks":                        "computer networks",
    "computer networking":                      "computer networks",

    # --- RAG ---
    "rag":                                                  "rag (retrieval augmented generation)",
    "rag (retrieval augmented generation)":                "rag (retrieval augmented generation)",
    "rag (retrieval-augmented generation)":                "rag (retrieval augmented generation)",

    # --- Generative AI ---
    "generative ai":                            "generative ai",
    "gen ai":                                   "generative ai",

    # --- LLM ---
    "llm":                                      "large language models",
    "llms":                                     "large language models",
    "large language models":                    "large language models",

    # --- NLP ---
    "nlp":                                      "natural language processing",
    "natural language processing":             "natural language processing",

    # --- ML ---
    "ml":                                       "machine learning",
    "machine learning":                         "machine learning",

    # --- DL ---
    "dl":                                       "deep learning",
    "deep learning":                            "deep learning",

    # --- AI ---
    "ai":                                       "artificial intelligence",
    "artificial intelligence":                 "artificial intelligence",

    # --- Node.js (dots → spaces after normalize) ---
    "node js":                                  "node js",
    "nodejs":                                   "node js",

    # --- Next.js ---
    "next js":                                  "next js",
    "nextjs":                                   "next js",

    # --- Nuxt.js ---
    "nuxt js":                                  "nuxt js",
    "nuxtjs":                                   "nuxt js",

    # --- Scikit-learn (dash → space after normalize) ---
    "scikit learn":                             "scikit-learn",

    # --- ASP.NET ---
    "asp net":                                  "asp.net",

    # --- CI/CD ---
    "ci/cd":                                    "ci/cd",

    # --- REST APIs ---
    "rest api":                                 "rest apis",
    "rest apis":                                "rest apis",

    # --- JWT ---
    "jwt authentication":                       "jwt authentication",

    # --- Vector Databases ---
    "vector databases":                         "vector databases",

    # --- Knowledge Graphs ---
    "knowledge graphs":                         "knowledge graphs",

    # --- BERT ---
    "bert":                                     "bert",

    # --- XGBoost ---
    "xgboost":                                  "xgboost",

    # --- Distributed Systems ---
    "distributed systems":                      "distributed systems",

    # --- Cloud Services ---
    "cloud services":                           "cloud services",

    # --- Microservices ---
    "microservices":                            "microservices",

    # --- Apache Spark ---
    "apache spark":                             "apache spark",

    # --- Programming Languages ---
    "python":       "python",
    "java":         "java",
    "javascript":   "javascript",
    "js":           "javascript",
    "typescript":   "typescript",
    "c":            "c",
    "c++":          "c++",
    "c#":           "c#",
    "go":           "go",
    "golang":       "go",
    "rust":         "rust",
    "swift":        "swift",
    "kotlin":       "kotlin",
    "dart":         "dart",
    "r":            "r",
    "matlab":       "matlab",
    "scala":        "scala",
    "perl":         "perl",
    "php":          "php",
    "ruby":         "ruby",
    "solidity":     "solidity",
    "assembly":     "assembly",

    # --- Frontend ---
    "react":            "react",
    "reactjs":          "react",
    "react native":     "react native",
    "angular":          "angular",
    "vue":              "vue",
    "tailwind css":     "tailwind css",
    "bootstrap":        "bootstrap",
    "html":             "html",
    "css":              "css",
    "sass":             "sass",
    "scss":             "sass",
    "redux":            "redux",

    # --- Backend ---
    "express":          "express",
    "flask":            "flask",
    "django":           "django",
    "fastapi":          "fastapi",
    "spring boot":      "spring boot",
    "laravel":          "laravel",
    "ruby on rails":    "ruby on rails",
    "graphql":          "graphql",
    "websocket":        "websocket",
    "soap":             "soap",

    # --- Databases ---
    "postgresql":       "postgresql",
    "mysql":            "mysql",
    "mongodb":          "mongodb",
    "redis":            "redis",
    "sqlite":           "sqlite",
    "oracle":           "oracle",
    "cassandra":        "cassandra",
    "dynamodb":         "dynamodb",
    "neo4j":            "neo4j",
    "mariadb":          "mariadb",
    "elasticsearch":    "elasticsearch",
    "firebase":         "firebase",
    "sql":              "sql",
    "nosql":            "nosql",

    # --- DevOps & Cloud ---
    "docker":           "docker",
    "kubernetes":       "kubernetes",
    "jenkins":          "jenkins",
    "git":              "git",
    "github actions":   "github actions",
    "gitlab ci":        "gitlab ci",
    "terraform":        "terraform",
    "ansible":          "ansible",
    "aws":              "aws",
    "azure":            "azure",
    "gcp":              "gcp",
    "google cloud":     "gcp",
    "linux":            "linux",
    "devops":           "devops",
    "mlops":            "mlops",

    # --- Data Engineering ---
    "hadoop":           "hadoop",
    "kafka":            "kafka",
    "airflow":          "airflow",
    "etl":              "etl",
    "snowflake":        "snowflake",
    "databricks":       "databricks",
    "dbt":              "dbt",

    # --- ML Frameworks ---
    "tensorflow":       "tensorflow",
    "pytorch":          "pytorch",
    "keras":            "keras",
    "opencv":           "opencv",
    "transformers":     "transformers",
    "hugging face":     "hugging face",
    "pandas":           "pandas",
    "numpy":            "numpy",
    "matplotlib":       "matplotlib",
    "seaborn":          "seaborn",
    "scipy":            "scipy",
    "plotly":           "plotly",

    # --- Agile ---
    "agile":            "agile",
    "scrum":            "scrum",
    "jira":             "jira",
}

# Helper Functions

def map_aliases(skills_set, alias_dict):
    mapped = set()
    for skill in skills_set:
        skill_norm = normalize_text(skill)
        mapped.add(alias_dict.get(skill_norm, skill_norm))
    return mapped


def encode_max_pooling(text: str, chunk_size: int = 200):
    words = text.split()
    if not words:
        # Return explicit empty tensor so caller can handle invalid semantic input.
        return torch.tensor([])
    chunks = [" ".join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]
    embeddings = _get_sbert_model().encode(chunks, convert_to_tensor=True)
    pooled = torch.mean(embeddings, dim=0)
    if pooled.ndim == 1:
        pooled = pooled.unsqueeze(0)
    return pooled


def load_skills(file_path: str) -> list:
    """Load skills from txt file, normalize each line"""
    skills = []
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            skill = line.strip()
            if skill:
                skills.append(normalize_text(skill))
    return sorted(list(set(skills)))




def compute_scores(
    clean_resume: str,
    clean_jd: str,
    skills_list_or_file: str | list = "skills.txt",
):
    
    if isinstance(skills_list_or_file, list):
        skills_list = sorted(list(set(
            normalize_text(s) for s in skills_list_or_file if str(s).strip()
        )))
    else:
        skills_list = load_skills(skills_list_or_file)

    
    norm_resume = normalize_text(clean_resume)
    norm_jd = normalize_text(clean_jd)

    
    resume_doc = nlp(norm_resume)
    jd_doc = nlp(norm_jd)

    
    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    matcher.add("SKILLS", [nlp(skill) for skill in skills_list])

    
    resume_skills_raw = {resume_doc[start:end].text for _, start, end in matcher(resume_doc)}
    jd_skills_raw = {jd_doc[start:end].text for _, start, end in matcher(jd_doc)}

    
    resume_skills_mapped = map_aliases(resume_skills_raw, skill_aliases)
    jd_skills_mapped = map_aliases(jd_skills_raw, skill_aliases)

    common_skills = resume_skills_mapped.intersection(jd_skills_mapped)
    spacy_score = len(common_skills) / len(jd_skills_mapped) if jd_skills_mapped else 0.0

 
    resume_keywords = {
        token.lemma_.lower() for token in resume_doc
        if token.pos_ in ["NOUN", "PROPN"] and token.is_alpha
        and not token.is_stop and len(token.text) > 2
    }
    jd_keywords = {
        token.lemma_.lower() for token in jd_doc
        if token.pos_ in ["NOUN", "PROPN"] and token.is_alpha
        and not token.is_stop and len(token.text) > 2
    }
    common_keywords = resume_keywords.intersection(jd_keywords)
    pos_score = len(common_keywords) / len(jd_keywords) if jd_keywords else 0.0

    
    resume_embedding = encode_max_pooling(clean_resume)
    jd_embedding = encode_max_pooling(clean_jd)
    if resume_embedding.numel() == 0 or jd_embedding.numel() == 0:
        sbert_score = 0.0
    else:
        sbert_score = float(util.cos_sim(resume_embedding, jd_embedding).item())

    
    final_score = spacy_score * 0.5 + sbert_score * 0.3 + pos_score * 0.2

    return {
        "resume_skills":    resume_skills_mapped,
        "jd_skills":        jd_skills_mapped,
        "common_skills":    common_skills,
        "spacy_score":      round(spacy_score, 4),
        "resume_keywords":  resume_keywords,
        "jd_keywords":      jd_keywords,
        "common_keywords":  common_keywords,
        "pos_score":        round(pos_score, 4),
        "sbert_score":      round(sbert_score, 4),
        "final_score":      round(final_score, 4),
    }