# import string
# from spellchecker import SpellChecker

# spell = SpellChecker()

# ABBREVIATIONS = {
#     "ml":   "machine learning",
#     "ai":   "artificial intelligence",
#     "nlp":  "natural language processing",
#     "cv":   "computer vision",
#     "dl":   "deep learning",
#     "rl":   "reinforcement learning",
#     "llm":  "large language model",
#     "api":  "application programming interface",
#     "swe":  "software engineer",
#     "sde":  "software development engineer",
#     "pm":   "product manager",
#     "ds":   "data science",
#     "dsa":  "data structures and algorithms",
#     "sd":   "system design",
#     "lc":   "leetcode",
#     "tc":   "total compensation",
#     "rsu":  "restricted stock unit",
#     "ctc":  "cost to company",
#     "ms":   "microsoft",
#     "fb":   "meta",
#     "goog": "google",
#     "amzn": "amazon",
# }

# spell.word_frequency.load_words(list(ABBREVIATIONS.keys()))


# def preprocess_query(query: str) -> str:
#     words = query.split()
#     corrected = []

#     for word in words:
#         clean_word = word.strip(string.punctuation).lower()
#         if clean_word in ABBREVIATIONS:
#             corrected.append(clean_word)
#         else:
#             fixed = spell.correction(clean_word) or clean_word
#             corrected.append(fixed)

#     query = " ".join(corrected)
#     expanded = [ABBREVIATIONS.get(w, w) for w in query.lower().split()]
#     return " ".join(expanded)


import string
from spellchecker import SpellChecker

spell = SpellChecker()

ABBREVIATIONS = {
    "ml":   "machine learning",
    "ai":   "artificial intelligence",
    "nlp":  "natural language processing",
    "cv":   "computer vision",
    "dl":   "deep learning",
    "rl":   "reinforcement learning",
    "llm":  "large language model",
    "api":  "application programming interface",
    "swe":  "software engineer",
    "sde":  "software development engineer",
    "pm":   "product manager",
    "ds":   "data science",
    "dsa":  "data structures and algorithms",
    "sd":   "system design",
    "lc":   "leetcode",
    "tc":   "total compensation",
    "rsu":  "restricted stock unit",
    "ctc":  "cost to company",
    "ms":   "microsoft",
    "fb":   "meta",
    "goog": "google",
    "amzn": "amazon",
}

# Words the spell checker should never modify
PROTECTED_WORDS = {
    "google", "amazon", "microsoft", "meta", "apple",
    "flipkart", "netflix", "adobe", "uber", "linkedin",
    "leetcode", "github", "chromadb", "faang", "maang",
    "groq", "llama", "openai", "anthropic",
    "dsa", "swe", "sde", "lpa", "ctc", "rsu", "gsu",
    "l3", "l4", "l5", "l6", "l7",
}

# Load all known words so spell checker doesn't touch them
spell.word_frequency.load_words(list(ABBREVIATIONS.keys()))
spell.word_frequency.load_words(list(PROTECTED_WORDS))


def preprocess_query(query: str) -> str:
    words = query.split()
    result = []

    for word in words:
        clean_word = word.strip(string.punctuation).lower()

        # 1. If it's an abbreviation — expand it
        if clean_word in ABBREVIATIONS:
            result.append(ABBREVIATIONS[clean_word])  # ✅ expand to full form

        # 2. If it's a protected word — keep it exactly as-is
        elif clean_word in PROTECTED_WORDS:
            result.append(clean_word)  # ✅ don't touch it

        # 3. Otherwise — spell correct it
        else:
            fixed = spell.correction(clean_word) or clean_word
            result.append(fixed)

    return " ".join(result)