# import os
# import logging

# # Silence HF Hub / transformers logs and progress bars
# os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

# logging.getLogger("transformers").setLevel(logging.ERROR)
# logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
# logging.getLogger("huggingface_hub").setLevel(logging.ERROR)

# from sentence_transformers import SentenceTransformer,util
# #Load the model
# model = SentenceTransformer('all-mpnet-base-v2')

# # resume_text = "Experienced in natural language processing and neural networks."
# # jd_text = "We need a candidate skilled in natural language processing and neural networks."
# with open("resume.txt", "r", encoding="utf-8") as file:
#     resume_text = file.read()


# # -------- Load JD --------
# with open("jd.txt", "r", encoding="utf-8") as f:
#     jd_text = f.read()


# resume_embedding = model.encode(resume_text,convert_to_tensor=True)
# jd_embedding = model.encode(jd_text,convert_to_tensor=True)

# # 4️⃣ Compute similarity
# similarity_score = util.cos_sim(resume_embedding, jd_embedding)
# print(f"Similarity Score: {float(similarity_score):.4f}")


# import os
# import logging
# import torch

# # Silence logs
# os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
# logging.getLogger("transformers").setLevel(logging.ERROR)
# logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
# logging.getLogger("huggingface_hub").setLevel(logging.ERROR)

# from sentence_transformers import SentenceTransformer, util

# # -------- Load Model --------
# model = SentenceTransformer('all-mpnet-base-v2')

# # -------- Chunk + Average Function --------
# def encode_full_text(text, chunk_size=200):
#     words = text.split()
#     chunks = [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
#     print(f"  → Split into {len(chunks)} chunk(s)")
#     embeddings = model.encode(chunks, convert_to_tensor=True)
#     avg_embedding = torch.mean(embeddings, dim=0)
#     return avg_embedding

# # -------- Load Resume --------
# with open("resume.txt", "r", encoding="utf-8") as f:
#     resume_text = f.read()

# # -------- Load JD --------
# with open("jd.txt", "r", encoding="utf-8") as f:
#     jd_text = f.read()

# # -------- Encode --------
# print("Encoding Resume...")
# resume_embedding = encode_full_text(resume_text)

# print("Encoding JD...")
# jd_embedding = encode_full_text(jd_text)

# # -------- Compute Similarity --------
# similarity_score = util.cos_sim(resume_embedding, jd_embedding)
# print(f"\nSimilarity Score: {float(similarity_score):.4f}")



# import os
# import logging
# import torch

# # Silence logs
# os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
# logging.getLogger("transformers").setLevel(logging.ERROR)
# logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
# logging.getLogger("huggingface_hub").setLevel(logging.ERROR)

# from sentence_transformers import SentenceTransformer, util

# # -------- Load Model --------
# model = SentenceTransformer('multi-qa-mpnet-base-dot-v1')

# # -------- Load Texts --------
# with open("resume.txt", "r", encoding="utf-8") as f:
#     resume_text = f.read()

# with open("jd.txt", "r", encoding="utf-8") as f:
#     jd_text = f.read()

# # -------- Chunk + Average Function --------
# def encode_full_text(text, chunk_size=200):
#     words = text.split()
#     chunks = [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
#     print(f"  → Split into {len(chunks)} chunk(s)")
#     embeddings = model.encode(chunks, convert_to_tensor=True)
#     avg_embedding = torch.mean(embeddings, dim=0)
#     return avg_embedding

# # -------- Encode --------
# print("Encoding Resume...")
# resume_embedding = encode_full_text(resume_text)

# print("Encoding JD...")
# jd_embedding = encode_full_text(jd_text)

# # -------- Compute Similarity --------
# similarity_score = util.cos_sim(resume_embedding, jd_embedding)
# print(f"\nSimilarity Score: {float(similarity_score):.4f}")


import os
import logging
import torch

# Silence logs
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)

from sentence_transformers import SentenceTransformer, util

# -------- Load Model --------
model = SentenceTransformer('all-mpnet-base-v2')

# -------- Load Texts --------
with open("testres.txt", "r", encoding="utf-8") as f:
    resume_text = f.read()

with open("testjd.txt", "r", encoding="utf-8") as f:
    jd_text = f.read()
    
def encode_max_pooling(text, chunk_size=200):
    words = text.split()
    chunks = [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
    print(f"  → Split into {len(chunks)} chunk(s)")
    embeddings = model.encode(chunks, convert_to_tensor=True)
    max_embedding = torch.mean(embeddings, dim=0)
    return max_embedding

# -------- Encode --------
print("Encoding Resume...")
resume_embedding = encode_max_pooling(resume_text)

print("Encoding JD...")
jd_embedding = encode_max_pooling(jd_text)

# -------- Compute Similarity --------
similarity_score = util.cos_sim(resume_embedding, jd_embedding)
print(f"\nSimilarity Score: {float(similarity_score):.4f}")