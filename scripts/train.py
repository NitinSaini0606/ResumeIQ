# import pandas as pd
# from sklearn.linear_model import LogisticRegression
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import classification_report, confusion_matrix
# from sklearn.preprocessing import StandardScaler
# from sklearn.metrics import precision_score, recall_score, f1_score
# import numpy as np
# import joblib
# import os

# # =========================================================
# # 1. Load Data
# # =========================================================
# csv_path = os.path.join(os.path.dirname(__file__), 'scores.csv')
# df = pd.read_csv(csv_path, header=None, skip_blank_lines=True)

# # Assign column names
# df.columns = ['resume', 'jd', 'skill_overlap', 'pos_score', 
#               'sbert_score', 'experience', 'label']

# print("=" * 55)
# print("DATASET OVERVIEW")
# print("=" * 55)
# print(f"Total rows        : {len(df)}")
# print(f"Label=1 (good)    : {sum(df['label']==1)}")
# print(f"Label=0 (bad)     : {sum(df['label']==0)}")
# print(f"Features          : skill_overlap, pos_score, sbert_score, experience, exp_flag")  # CHANGE 1

# # =========================================================
# # 2. Features and Labels
# # =========================================================

# # CHANGE 2 — Add experience flag
# df['exp_flag'] = df['experience'].apply(
#     lambda x: -1 if x < 0 else (0 if x == 0 else 1)
# )

# X = df[['skill_overlap', 'pos_score', 
#         'sbert_score', 'experience', 'exp_flag']]  # CHANGE 2
# y = df['label']

# # =========================================================
# # 3. Scale Features (important for Logistic Regression)
# # =========================================================
# scaler = StandardScaler()
# X_scaled = scaler.fit_transform(X)

# # =========================================================
# # 4. Train Test Split
# # =========================================================
# X_train, X_test, y_train, y_test = train_test_split(
#     X_scaled, y,
#     test_size=0.2,
#     random_state=42,
#     stratify=y        # keeps class balance in both sets
# )

# print(f"\nTraining samples  : {len(X_train)}")
# print(f"Testing samples   : {len(X_test)}")

# # =========================================================
# # 5. Train Model
# # =========================================================
# model = LogisticRegression(
#     class_weight='balanced',
#     solver='lbfgs',
#     max_iter=1000,
#     random_state=42
# )
# model.fit(X_train, y_train)
# print("\n✅ Model trained successfully!")

# # =========================================================
# # 6. Predict
# # =========================================================
# y_pred = model.predict(X_test)
# proba  = model.predict_proba(X_test)[:, 1]

# # =========================================================
# # 7. Classification Report
# # =========================================================
# print("\n" + "=" * 55)
# print("CLASSIFICATION REPORT")
# print("=" * 55)
# print(classification_report(
#     y_test, y_pred,
#     target_names=['BAD MATCH', 'GOOD MATCH']
# ))

# # =========================================================
# # 8. Confusion Matrix
# # =========================================================
# print("=" * 55)
# print("CONFUSION MATRIX")
# print("=" * 55)
# cm = confusion_matrix(y_test, y_pred)
# print(f"                   Predicted BAD   Predicted GOOD")
# print(f"Actual BAD              {cm[0][0]}                {cm[0][1]}")
# print(f"Actual GOOD             {cm[1][0]}                {cm[1][1]}")

# # =========================================================
# # 9. Feature Weights
# # =========================================================
# print("\n" + "=" * 55)
# print("FEATURE WEIGHTS (what model learned)")
# print("=" * 55)
# features = ['skill_overlap', 'pos_score', 
#             'sbert_score', 'experience', 'exp_flag']  # CHANGE 3
# weights  = model.coef_[0]
# for f, w in sorted(zip(features, weights), key=lambda x: abs(x[1]), reverse=True):
#     bar = "█" * int(abs(w) * 5)
#     direction = "+" if w > 0 else "-"
#     print(f"{f:20} {direction}{abs(w):.4f}  {bar}")

# # =========================================================
# # 10. Threshold Analysis
# # =========================================================
# print("\n" + "=" * 55)
# print("THRESHOLD ANALYSIS")
# print("=" * 55)
# print(f"{'Threshold':<12}{'Precision':<12}{'Recall':<12}{'F1':<12}")
# print("-" * 48)
# best_f1 = 0
# best_threshold = 0.5
# for t in [0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65]:
#     preds = (proba >= t).astype(int)
#     p = precision_score(y_test, preds, zero_division=0)
#     r = recall_score(y_test, preds, zero_division=0)
#     f = f1_score(y_test, preds, zero_division=0)
#     if f > best_f1:
#         best_f1 = f
#         best_threshold = t
#     marker = " ← best" if t == best_threshold else ""
#     print(f"{t:<12}{p:<12.2f}{r:<12.2f}{f:<12.2f}{marker}")

# # =========================================================
# # 11. Individual Predictions
# # =========================================================
# print("\n" + "=" * 55)
# print("INDIVIDUAL TEST PREDICTIONS")
# print("=" * 55)
# print(f"{'#':<5}{'Probability':<14}{'Predicted':<14}{'Actual':<12}{'Result'}")
# print("-" * 55)
# y_test_list = list(y_test)
# correct = 0
# for i, (prob, actual) in enumerate(zip(proba, y_test_list)):
#     predicted  = 1 if prob >= 0.5 else 0
#     result     = "✅ CORRECT" if predicted == actual else "❌ WRONG"
#     pred_label = "GOOD MATCH" if predicted == 1 else "BAD MATCH"
#     act_label  = "GOOD MATCH" if actual    == 1 else "BAD MATCH"
#     if predicted == actual:
#         correct += 1
#     print(f"{i+1:<5}{prob:<14.3f}{pred_label:<14}{act_label:<12}{result}")

# print(f"\nCorrect: {correct}/{len(y_test_list)}")

# # =========================================================
# # 12. Save Model
# # =========================================================
# output_dir = os.path.join(os.path.dirname(__file__), 
#              '..', 'output')
# os.makedirs(output_dir, exist_ok=True)

# joblib.dump(model,  os.path.join(output_dir, 'model.pkl'))
# joblib.dump(scaler, os.path.join(output_dir, 'scaler.pkl'))
# print(f"\n✅ Model saved  → output/model.pkl")
# print(f"✅ Scaler saved → output/scaler.pkl")


import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import precision_score, recall_score, f1_score
import numpy as np
import joblib
import json
import os

# 1. Load Data
csv_path = os.path.join(os.path.dirname(__file__), 'scores.csv')
df = pd.read_csv(csv_path, header=None)

# Assign column names
df.columns = ['resume', 'jd', 'skill_overlap', 'pos_score', 
              'sbert_score', 'experience', 'label']

print("=" * 55)
print("DATASET OVERVIEW")
print("=" * 55)
print(f"Total rows        : {len(df)}")
print(f"Label=1 (good)    : {sum(df['label']==1)}")
print(f"Label=0 (bad)     : {sum(df['label']==0)}")
print(f"Features          : skill_overlap, pos_score, sbert_score, experience, exp_flag")  # CHANGE 1

# 2. Features and Labels

# Add experience flag
df['exp_flag'] = df['experience'].apply(
    lambda x: -1 if x < 0 else (0 if x == 0 else 1)
)

X = df[['skill_overlap', 'pos_score', 
        'sbert_score', 'experience', 'exp_flag']]  
y = df['label']

# 3. Scale Features 

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 4. Train Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y,
    test_size=0.2,
    random_state=42,
    stratify=y        
)

print(f"\nTraining samples  : {len(X_train)}")
print(f"Testing samples   : {len(X_test)}")

# 5. Train Model

model = LogisticRegression(
    class_weight='balanced',
    solver='lbfgs',
    max_iter=1000,
    random_state=42
)
model.fit(X_train, y_train)
print("\n✅ Model trained successfully!")

# 6. Predict

y_pred = model.predict(X_test)
proba  = model.predict_proba(X_test)[:, 1]

# 7. Classification Report

print("\n" + "=" * 55)
print("CLASSIFICATION REPORT")
print("=" * 55)
print(classification_report(
    y_test, y_pred,
    target_names=['BAD MATCH', 'GOOD MATCH']
))

# 8. Confusion Matrix

print("=" * 55)
print("CONFUSION MATRIX")
print("=" * 55)
cm = confusion_matrix(y_test, y_pred)
print(f"                   Predicted BAD   Predicted GOOD")
print(f"Actual BAD              {cm[0][0]}                {cm[0][1]}")
print(f"Actual GOOD             {cm[1][0]}                {cm[1][1]}")

# 9. Feature Weights

print("\n" + "=" * 55)
print("FEATURE WEIGHTS ")
print("=" * 55)
features = ['skill_overlap', 'pos_score', 
            'sbert_score', 'experience', 'exp_flag']  # CHANGE 3
weights  = model.coef_[0]
for f, w in sorted(zip(features, weights), key=lambda x: abs(x[1]), reverse=True):
    bar = "█" * int(abs(w) * 5)
    direction = "+" if w > 0 else "-"
    print(f"{f:20} {direction}{abs(w):.4f}  {bar}")

# 10. Threshold Analysis

print("\n" + "=" * 55)
print("THRESHOLD ANALYSIS")
print("=" * 55)
print(f"{'Threshold':<12}{'Precision':<12}{'Recall':<12}{'F1':<12}")
print("-" * 48)
best_f1 = 0
best_threshold = 0.5
for t in [0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65]:
    preds = (proba >= t).astype(int)
    p = precision_score(y_test, preds, zero_division=0)
    r = recall_score(y_test, preds, zero_division=0)
    f = f1_score(y_test, preds, zero_division=0)
    if f > best_f1:
        best_f1 = f
        best_threshold = t
    marker = " ← best" if t == best_threshold else ""
    print(f"{t:<12}{p:<12.2f}{r:<12.2f}{f:<12.2f}{marker}")

# 11. Individual Predictions

print("\n" + "=" * 55)
print("INDIVIDUAL TEST PREDICTIONS")
print("=" * 55)
print(f"{'#':<5}{'Probability':<14}{'Predicted':<14}{'Actual':<12}{'Result'}")
print("-" * 55)
y_test_list = list(y_test)
correct = 0
for i, (prob, actual) in enumerate(zip(proba, y_test_list)):
    predicted  = 1 if prob >= 0.5 else 0
    result     = "✅ CORRECT" if predicted == actual else "❌ WRONG"
    pred_label = "GOOD MATCH" if predicted == 1 else "BAD MATCH"
    act_label  = "GOOD MATCH" if actual    == 1 else "BAD MATCH"
    if predicted == actual:
        correct += 1
    print(f"{i+1:<5}{prob:<14.3f}{pred_label:<14}{act_label:<12}{result}")

print(f"\nCorrect: {correct}/{len(y_test_list)}")

# 12. Cross Validation (checks if result is real or lucky)

print("\n" + "=" * 55)
print("CROSS VALIDATION (5-Fold)")
print("=" * 55)

cv_model = LogisticRegression(
    class_weight='balanced',
    solver='lbfgs',
    max_iter=1000,
    random_state=42
)

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

cv_results = cross_validate(
    cv_model,
    X_scaled, y,
    cv=cv,
    scoring=['precision', 'recall', 'f1', 'accuracy']
)

print(f"{'Fold':<8}{'Precision':<12}{'Recall':<12}{'F1':<12}{'Accuracy':<12}")
print("-" * 52)
for i in range(5):
    p = cv_results['test_precision'][i]
    r = cv_results['test_recall'][i]
    f = cv_results['test_f1'][i]
    a = cv_results['test_accuracy'][i]
    print(f"{i+1:<8}{p:<12.3f}{r:<12.3f}{f:<12.3f}{a:<12.3f}")

print("-" * 52)
print(f"{'MEAN':<8}"
      f"{cv_results['test_precision'].mean():<12.3f}"
      f"{cv_results['test_recall'].mean():<12.3f}"
      f"{cv_results['test_f1'].mean():<12.3f}"
      f"{cv_results['test_accuracy'].mean():<12.3f}")
print(f"{'STD':<8}"
      f"{cv_results['test_precision'].std():<12.3f}"
      f"{cv_results['test_recall'].std():<12.3f}"
      f"{cv_results['test_f1'].std():<12.3f}"
      f"{cv_results['test_accuracy'].std():<12.3f}")

print(f"\nReal F1 Score    : {cv_results['test_f1'].mean():.3f} "
      f"(+/- {cv_results['test_f1'].std():.3f})")
print(f"Real Accuracy    : {cv_results['test_accuracy'].mean():.3f} "
      f"(+/- {cv_results['test_accuracy'].std():.3f})")

# Verdict
mean_f1 = cv_results['test_f1'].mean()
std_f1  = cv_results['test_f1'].std()
print("\nVERDICT:")
if mean_f1 >= 0.85 and std_f1 <= 0.05:
    print("🟢 EXCELLENT — model is genuine and stable")
elif mean_f1 >= 0.75 and std_f1 <= 0.08:
    print("🟡 GOOD — model works well, minor variance")
elif mean_f1 >= 0.65 and std_f1 <= 0.10:
    print("🟠 OKAY — model works but needs more data")
else:
    print("🔴 UNSTABLE — got lucky, need more data")

# 13. Save Model

output_dir = os.path.join(os.path.dirname(__file__), 
             '..', 'output')
os.makedirs(output_dir, exist_ok=True)

joblib.dump(model,  os.path.join(output_dir, 'model.pkl'))
joblib.dump(scaler, os.path.join(output_dir, 'scaler.pkl'))
print(f"\n✅ Model saved  → output/model.pkl")
print(f"✅ Scaler saved → output/scaler.pkl")


features = ['skill_overlap', 'pos_score', 
            'sbert_score', 'experience', 'exp_flag']
weights  = model.coef_[0].tolist()

model_info = {
    "feature_weights": dict(zip(features, weights)),
    "intercept":       float(model.intercept_[0]),
    "scaler_mean":     dict(zip(features, scaler.mean_.tolist())),
    "scaler_std":      dict(zip(features, scaler.scale_.tolist())),
    "training_rows":   len(df),
    "label_1_count":   int(sum(df['label']==1)),
    "label_0_count":   int(sum(df['label']==0)),
    "cv_f1_mean":      round(float(cv_results['test_f1'].mean()), 4),
    "cv_f1_std":       round(float(cv_results['test_f1'].std()), 4),
    "cv_accuracy_mean":round(float(cv_results['test_accuracy'].mean()), 4),
}

weights_path = os.path.join(output_dir, 'model_info.json')
with open(weights_path, 'w') as f:
    json.dump(model_info, f, indent=4)

print(f"✅ Weights saved → output/model_info.json")



# import pandas as pd
# import os

# csv_path = os.path.join(os.path.dirname(__file__), 'scores.csv')
# df = pd.read_csv(csv_path, header=None)
# df.columns = ['resume', 'jd', 'skill_overlap', 'pos_score', 
#               'sbert_score', 'experience', 'label']

# print(f"\n{'#':<5}{'Resume':<15}{'JD':<18}{'Spacy':<8}{'POS':<8}{'SBERT':<8}{'Exp':<6}{'Label'}")
# print("-" * 75)
# for i, row in df.iterrows():
#     print(f"{i+1:<5}{row['resume']:<15}{row['jd']:<18}{row['skill_overlap']:<8}{row['pos_score']:<8}{row['sbert_score']:<8}{row['experience']:<6}{row['label']}")

# print(f"\nTotal rows: {len(df)}")

# # Column count check
# print("\nColumn check:")
# with open(csv_path, 'r') as f:
#     for i, line in enumerate(f):
#         cols = line.strip().split(',')
#         if len(cols) != 7:
#             print(f"❌ Row {i+1} has {len(cols)} cols → {line.strip()}")
# print("✅ Done")


# resume_47.txt,jdfrontend.txt,0.375,0.3382,0.3033,0,0
# resume_47.txt,jdfullStack.txt,0.6071,0.4253,0.5488,0,0
# resume_47.txt,jdseexp.txt,0.8421,0.619,0.4955,0,1
# resume_47.txt,jdaiml.txt,0.9091,0.6458,0.6699,0,1
# resume_48.txt,jdaiml.txt,0.9091,0.6875,0.6804,0,1
# resume_48.txt,jdseexp.txt,0.7895,0.5833,0.5048,0,1
# resume_48.txt,jdfrontend.txt,0.375,0.3088,0.3237,0,0
# resume_48.txt,jdfullStack.txt,0.6071,0.4138,0.5564,0,0
# resume_49.txt,jdfullStack.txt,0.4643,0.3563,0.5145,0,0



# {
#     "feature_weights": {
#         "skill_overlap": 2.2480074718194984,
#         "pos_score": 0.6861186705049819,
#         "sbert_score": 1.3315744168816857,
#         "experience": -0.8876579563073095,
#         "exp_flag": 0.9558117229146009
#     },
#     "intercept": -0.22018850068092938,
#     "scaler_mean": {
#         "skill_overlap": 0.5851227272727274,
#         "pos_score": 0.5226818181818181,
#         "sbert_score": 0.5582295454545454,
#         "experience": 1.2045454545454546,
#         "exp_flag": 0.32575757575757575
#     },
#     "scaler_std": {
#         "skill_overlap": 0.2603634361376621,
#         "pos_score": 0.15338354570704094,
#         "sbert_score": 0.10418185058205906,
#         "experience": 2.1417163761368294,
#         "exp_flag": 0.5293823176119351
#     },
#     "training_rows": 132,
#     "label_1_count": 62,
#     "label_0_count": 70,
#     "cv_f1_mean": 0.9064,
#     "cv_f1_std": 0.0704,
#     "cv_accuracy_mean": 0.9085
# }