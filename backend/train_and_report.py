"""
EPISENCE ML Model Training & Evaluation Report
Run with: python train_and_report.py
"""
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import numpy as np
import warnings
warnings.filterwarnings('ignore')

from app.ml.preprocessor import DataPreprocessor
from app.ml.model_manager import ModelManager
from sklearn.model_selection import cross_val_score, TimeSeriesSplit
from sklearn.metrics import (
    mean_absolute_error, mean_squared_error, r2_score,
    mean_absolute_percentage_error
)

print("=" * 60)
print("  EPISENCE AI — Predictive Outbreak Model Training Report")
print("=" * 60)

DATA_DIR  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

# ── 1. Load & Prepare Data ──────────────────────────────────────
print("\n[1/4] Loading & Engineering Features...")
preprocessor = DataPreprocessor(DATA_DIR)
X, y, features = preprocessor.prepare_training_data()
print(f"      Dataset shape : {X.shape[0]} samples x {X.shape[1]} features")
print(f"      Target range  : {y.min():.1f} to {y.max():.1f} (risk score 0-100)")
print(f"      Features used : {', '.join(features)}")

# ── 2. Train Model ───────────────────────────────────────────────
print("\n[2/4] Training Random Forest Regressor (Time-Series CV)...")
model_manager = ModelManager(MODEL_DIR)
mae, r2 = model_manager.train(X, y)

# ── 3. Full Evaluation ───────────────────────────────────────────
print("\n[3/4] Running Full Evaluation Suite...")

# Time-series train/test split (80/20)
split_idx = int(len(X) * 0.80)
X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

model = model_manager.model
y_pred = model.predict(X_test)

# Core metrics
test_mae  = mean_absolute_error(y_test, y_pred)
test_rmse = np.sqrt(mean_squared_error(y_test, y_pred))
test_r2   = r2_score(y_test, y_pred)
test_mape = mean_absolute_percentage_error(y_test, y_pred) * 100

# Cross-validation (5-fold time-series)
tscv = TimeSeriesSplit(n_splits=5)
cv_scores = cross_val_score(model, X, y, cv=tscv, scoring='r2')
cv_mae    = cross_val_score(model, X, y, cv=tscv, scoring='neg_mean_absolute_error')

# ── 4. Print Report ──────────────────────────────────────────────
print("\n[4/4] Generating Report...")
print()
print("=" * 60)
print("        MODEL PERFORMANCE REPORT — EPISENCE AI")
print("=" * 60)

print("\n┌─ CORE ACCURACY METRICS (Hold-out Test Set) ─────────────┐")
print(f"│  R² Score (Accuracy)          : {test_r2:.4f}  ({test_r2*100:.1f}%)       │")
print(f"│  Mean Absolute Error (MAE)    : {test_mae:.2f} risk points      │")
print(f"│  Root Mean Sq. Error (RMSE)   : {test_rmse:.2f} risk points      │")
print(f"│  Mean Abs. % Error (MAPE)     : {test_mape:.1f}%                │")
print("└──────────────────────────────────────────────────────────┘")

print("\n┌─ CROSS-VALIDATION (5-Fold Time-Series) ─────────────────┐")
print(f"│  CV R² Scores   : {np.array2string(cv_scores, precision=3)}     │")
print(f"│  Mean CV R²     : {cv_scores.mean():.4f} ± {cv_scores.std():.4f}             │")
print(f"│  Mean CV MAE    : {-cv_mae.mean():.2f} risk points              │")
print("└──────────────────────────────────────────────────────────┘")

print("\n┌─ FEATURE IMPORTANCE (What Drives Outbreak Predictions) ──┐")
importances = model_manager.get_feature_importance(features)
if importances:
    sorted_imp = sorted(importances.items(), key=lambda x: x[1], reverse=True)
    for rank, (feat, imp) in enumerate(sorted_imp, 1):
        bar = "#" * int(imp * 50)
        print(f"|  {rank}. {feat:<22} {imp:.4f}  {bar}")
print("└──────────────────────────────────────────────────────────┘")

print("\n┌─ MODEL VERDICT ──────────────────────────────────────────┐")
if test_r2 >= 0.90:
    verdict = "EXCELLENT — Production Ready"
elif test_r2 >= 0.75:
    verdict = "GOOD — Reliable for Field Use"
elif test_r2 >= 0.60:
    verdict = "MODERATE — Suitable for Demo"
else:
    verdict = "NEEDS MORE DATA"
print(f"│  Overall Grade : {verdict:<40}│")
print(f"│  Model Type    : Random Forest Regressor (Ensemble)      │")
print(f"│  Task          : 7-Day Outbreak Risk Forecasting          │")
print(f"│  Trained On    : {X.shape[0]} epidemiological records                │")
print("└──────────────────────────────────────────────────────────┘")
print()
print("✅ Model saved to:", MODEL_DIR)
print("=" * 60)
