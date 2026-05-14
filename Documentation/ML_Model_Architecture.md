# Technical Documentation: Disease Risk Prediction Model

This document provides a deep dive into the Machine Learning architecture, data pipeline, and predictive logic used in the **EPISENCE** platform.

---

## 1. Data Ingestion (The "Input")
The model consumes a multi-modal dataset stored in JSON format within the `backend/data/` directory.

### A. Raw Datasets
| Dataset | Filename | Key Fields | Purpose |
| :--- | :--- | :--- | :--- |
| **Weather** | `weather_data.json` | `temp_avg`, `humidity_avg`, `rainfall_mm` | Meteorological drivers of vector breeding. |
| **Clinical** | `hospital_cases.json` | `case_count`, `disease_type`, `zone_id` | Real-time epidemiological ground truth. |
| **Geo-Metadata**| `zones.json` | `id`, `name`, `ward_name` | Spatial context for mapping predictions. |
| **Historical Risk**| `risk_scores.json` | `composite_score`, `date` | The "target" values for training. |

### B. Data Merging Strategy
The engine performs a **left-join** operation using `(zone_id, date)` as the composite key. 
1. Weather data acts as the primary timeline.
2. Clinical case counts are aggregated per day/zone and merged.
3. Missing clinical data is filled with `0` (assuming no cases reported).
4. Missing risk scores are forward-filled (`ffill`) and backward-filled (`bfill`) to ensure a continuous training signal.

---

## 2. Advanced Feature Engineering
To move from "simple accuracy" to "accurate output," we transform raw data into "signal" using domain-specific knowledge.

### A. Seasonality & Temporal Context
*   **Month & Monsoon Flag**: Disease patterns in Pune are cyclical. We extract the `month` and create an `is_monsoon` boolean (June–Sept). This helps the model "know" that 30mm of rain in July is more significant than 30mm in January.
*   **EWMA (Exponential Weighted Moving Averages)**: Unlike simple averages, EWMA gives more weight to recent days.
    *   `temp_ewma_7d`: Captures recent temperature stability.
    *   `rain_ewma_14d`: Captures cumulative rainfall (the "puddle effect" for mosquito breeding).
    *   `cases_ewma_7d`: Captures the immediate momentum of a rising outbreak.

### B. Biological Interaction Terms
*   **Heat-Humidity Index**: Mosquitoes require a specific threshold of both heat and moisture. We create an interaction term (`temperature * humidity`). A high score here is a strong predictor of vector activity.

### C. Lag & Target Generation
*   **Lags**: We shift case counts by 7 and 14 days (`cases_lag_7d`, `cases_lag_14d`) to account for the incubation period and reporting delays.
*   **The Target**: We shift the `composite_score` backwards by 7 days. This means the model learns to look at **today's weather** and **yesterday's cases** to predict **next week's risk**.

---

## 3. Model Architecture
We use a **Gradient Boosting Regressor (GBM)** for the core engine.

### Why Gradient Boosting?
1.  **Sequential Learning**: GBM builds trees sequentially, with each new tree correcting the errors of the previous one. This is excellent for capturing the subtle nuances of epidemiological shifts.
2.  **Huber Loss Function**: We use 'huber' loss instead of standard MSE. Huber loss is less sensitive to outliers, which is critical because disease data often contains reporting "spikes" that can confuse simpler models.

### Validation Strategy: TimeSeriesSplit
Standard random splits are forbidden here. We use **TimeSeriesSplit** with 5 folds.
- **Fold 1**: Train on Month 1, Test on Month 2.
- **Fold 2**: Train on Months 1-2, Test on Month 3.
- ... and so on.
This ensures the model never "cheats" by seeing the future, making the validation MAE (Mean Absolute Error) a reliable proxy for real-world performance.

---

## 4. Model Output & Interpretation
The output is a continuous score from **0.0 to 100.0**.

### A. Output Post-Processing
All raw predictions are clipped to the `[0, 100]` range. This ensures that even in extreme weather edge-cases, the dashboard never displays impossible values (like -5% risk).

### B. Feature Importance
The model provides an "Importance Matrix" which helps us understand *why* a risk is high:
- If **Rain EWMA** is the top feature: The risk is driven by environmental conditions.
- If **Case Lag** is the top feature: The risk is driven by human transmission momentum.

---

## 5. Deployment Lifecycle
1.  **Exploration**: `research/risk_prediction_model.ipynb` is used to tune features and visualize trends.
2.  **Training**: `app/ml/train.py` automates the training and saves the model to `models/risk_predictor.joblib`.
3.  **Inference**: The FastAPI backend loads this `.joblib` file and serves predictions via the `/api/predict` endpoint.
