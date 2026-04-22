# scripts/preprocess.py

# import re
# import spacy

# # Load spaCy once
# nlp = spacy.load("en_core_web_lg")

# def clean_text(text):
#     text = text.lower()

#     # Remove emails
#     text = re.sub(r'\S+@\S+', ' ', text)

#     # Remove phone numbers
#     text = re.sub(r'\+?\d[\d\s\-]{8,}\d', ' ', text)

#     # Remove bullet symbols
#     text = re.sub(r'[•▪➤►◆★]', ' ', text)

#     # Replace multiple line breaks with space
#     text = re.sub(r'\n+', ' ', text)

#     # Remove extra spaces
#     text = re.sub(r'\s+', ' ', text)

#     # Remove URLs
#     text = re.sub(r'http\S+|www\S+|linkedin\S+|github\S+', ' ', text)

#     # Remove percentages
#     text = re.sub(r'\d+\.?\d*%', ' ', text)

#     # Remove CGPA pattern
#     text = re.sub(r'cgpa\s*[:\-]?\s*\d+\.?\d*\/?\d*', ' ', text)

#     # Remove standalone years
#     text = re.sub(r'\b(19|20)\d{2}\b', ' ', text)

#     # Remove multiple symbols like | and -
#     text = re.sub(r'[|]', ' ', text)

#     return text.strip()


# def extract_sentences(text, min_length=20):
#     doc = nlp(text)
#     sentences = [
#         sent.text.strip()
#         for sent in doc.sents
#         if len(sent.text.strip()) > min_length
#     ]
#     return sentences


# def preprocess_text(raw_text):
#     cleaned = clean_text(raw_text)
#     sentences = extract_sentences(cleaned)
#     return " ".join(sentences)



# # -------- Read Resume --------
# with open("try.txt", "r", encoding="utf-8") as f:
#     raw_resume = f.read()

# # -------- Read JD --------
# with open("tryjd.txt", "r", encoding="utf-8") as f:
#     raw_jd = f.read()

# # -------- Preprocess --------
# clean_resume = preprocess_text(raw_resume)
# clean_jd = preprocess_text(raw_jd)

# # -------- Print Results --------
# print("\n========== CLEAN RESUME ==========\n")
# print(clean_resume)

# print("\n========== CLEAN JD ==========\n")
# print(clean_jd)




# import re
# import spacy

# # Load spaCy once
# nlp = spacy.load("en_core_web_lg")


# # -------------------------------
# # BASIC CLEANING
# # -------------------------------
# def clean_text(text):
#     text = text.lower()

#     # Remove emails
#     text = re.sub(r'\S+@\S+', ' ', text)

#     # Remove phone numbers
#     text = re.sub(r'\+?\d[\d\s\-]{8,}\d', ' ', text)

#     # Remove URLs
#     text = re.sub(r'http\S+|www\S+|linkedin\S+|github\S+', ' ', text)

#     # Remove bullet symbols
#     text = re.sub(r'[•▪➤►◆★]', ' ', text)

#     # Remove percentages
#     text = re.sub(r'\d+\.?\d*%', ' ', text)

#     # Remove CGPA pattern
#     text = re.sub(r'cgpa\s*[:\-]?\s*\d+\.?\d*\/?\d*', ' ', text)

#     # Remove standalone years
#     text = re.sub(r'\b(19|20)\d{2}\b', ' ', text)

#     # Remove separators like |
#     text = re.sub(r'[|]', ' ', text)

#     # Replace multiple line breaks with space
#     text = re.sub(r'\n+', ' ', text)

#     # Remove extra spaces
#     text = re.sub(r'\s+', ' ', text)

#     return text.strip()


# # -------------------------------
# # KEEP ONLY TECHNICAL SECTIONS
# # -------------------------------
# def keep_technical_sections(text):
#     """
#     Keep from 'skills' onwards.
#     Remove achievements and leadership sections.
#     """

#     # Keep everything starting from skills
#     skills_match = re.search(r'skills', text)

#     if skills_match:
#         text = text[skills_match.start():]

#     # Remove achievements section
#     text = re.sub(r'achievements.*', ' ', text, flags=re.DOTALL)

#     # Remove leadership section
#     text = re.sub(r'leadership.*', ' ', text, flags=re.DOTALL)

#     # Remove education if still present
#     text = re.sub(r'education.*?skills', 'skills', text, flags=re.DOTALL)

#     return text.strip()


# # -------------------------------
# # SENTENCE EXTRACTION
# # -------------------------------
# def extract_sentences(text, min_length=20):
#     doc = nlp(text)
#     sentences = [
#         sent.text.strip()
#         for sent in doc.sents
#         if len(sent.text.strip()) > min_length
#     ]
#     return sentences


# # -------------------------------
# # FINAL PIPELINE
# # -------------------------------
# def preprocess_text(raw_text):
#     text = clean_text(raw_text)
#     text = keep_technical_sections(text)
#     sentences = extract_sentences(text)
#     return " ".join(sentences)




# from preprocess import preprocess_text

# # -------- Read Resume --------
# with open("try.txt", "r", encoding="utf-8") as f:
#     raw_resume = f.read()

# # -------- Read JD --------
# with open("tryjd.txt", "r", encoding="utf-8") as f:
#     raw_jd = f.read()

# # -------- Preprocess --------
# clean_resume = preprocess_text(raw_resume)
# clean_jd = preprocess_text(raw_jd)

# # -------- Print Results --------
# print("\n========== CLEAN RESUME ==========\n")
# print(clean_resume)

# print("\n========== CLEAN JD ==========\n")
# print(clean_jd)



import re
import spacy

# Load spaCy model once
nlp = spacy.load("en_core_web_lg")


# =========================================================
# BASIC CLEANING (Used for JD - Minimal Cleaning)
# =========================================================
def clean_basic(text):
    text = text.lower()

        #Remove emails
    text = re.sub(r'\S+@\S+', ' ', text)

    # Remove phone numbers
    text = re.sub(r'\+?\d[\d\s\-]{8,}\d', ' ', text)

    # Remove URLs
    text = re.sub(r'http\S+|www\S+|linkedin\S+|github\S+', ' ', text)

    # Remove bullet symbols
    text = re.sub(r'[•▪➤►◆★]', ' ', text)

    # Remove percentages
    text = re.sub(r'\d+\.?\d*%', ' ', text)

    # Remove CGPA pattern
    text = re.sub(r'cgpa\s*[:\-]?\s*\d+\.?\d*\/?\d*', ' ', text)

    # Remove standalone years
    text = re.sub(r'\b(19|20)\d{2}\b', ' ', text)

    # Remove separators like |
    text = re.sub(r'[|]', ' ', text)

    # Replace multiple line breaks with space
    text = re.sub(r'\n+', ' ', text)

   # Remove extra spaces
    text = re.sub(r'\s+', ' ', text)

    return text.strip()


# =========================================================
# RESUME-SPECIFIC CLEANING (Aggressive)
# =========================================================
def clean_resume(text):
    text = clean_basic(text)

    # Remove education section completely
    text = re.sub(r'(education|academic background)', 'Education', text, flags=re.IGNORECASE)
    text = re.sub(
    r'(january|february|march|april|may|june|july|august|september|october|november|december)\s*-\s*'
    r'(january|february|march|april|may|june|july|august|september|october|november|december)',
    ' ',
    text
    )

    # Remove first line if it looks like a name (very short line before skills)
    text = re.sub(r'^[a-z]+\s+[a-z]+\s+', ' ', text)

    # Remove achievements / awards / leadership
    text = re.sub(
        r'(achievements|awards|honors|leadership|extra[- ]?curricular).*',
        ' ',
        text,
        flags=re.DOTALL
    )

    # Remove standalone years
    text = re.sub(r'\b(19|20)\d{2}\b', ' ', text)

    # Remove bullet symbols and separators
    text = re.sub(r'[•▪➤►◆★|]', ' ', text)

    # Remove CGPA
    text = re.sub(r'cgpa\s*[:\-]?\s*\d+\.?\d*\/?\d*', ' ', text)

    # Remove extra spaces again
    text = re.sub(r'\s+', ' ', text)

    return text.strip()


# =========================================================
# SENTENCE FILTERING (Removes very small noisy lines)
# =========================================================
def extract_sentences(text, min_length=20):
    doc = nlp(text)
    sentences = [
        sent.text.strip()
        for sent in doc.sents
        if len(sent.text.strip()) > min_length
    ]
    # Fallback: if sentence filtering removes everything, keep cleaned text.
    if not sentences:
        return text.strip()
    return " ".join(sentences)


# =========================================================
# FINAL PIPELINES
# =========================================================
def preprocess_resume(raw_text):
    cleaned = clean_resume(raw_text)
    return extract_sentences(cleaned)


def preprocess_jd(raw_text):
    cleaned = clean_basic(raw_text)
    return extract_sentences(cleaned)


# =========================================================
# MAIN EXECUTION (Testing)
# =========================================================
if __name__ == "__main__":

    # -------- Read Resume --------
    with open("try.txt", "r", encoding="utf-8") as f:
        raw_resume = f.read()

    # -------- Read JD --------
    with open("tryjd.txt", "r", encoding="utf-8") as f:
        raw_jd = f.read()

    # -------- Preprocess --------
    clean_resume_text = preprocess_resume(raw_resume)
    clean_jd_text = preprocess_jd(raw_jd)

    # -------- Print Results --------
    print("\n========== CLEAN RESUME ==========\n")
    print(clean_resume_text)

    print("\n========== CLEAN JD ==========\n")
    print(clean_jd_text)