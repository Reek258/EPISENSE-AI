# Developer Guide: Building & Modifying the Risk Prediction Model

This guide provides a step-by-step walkthrough of how the `risk_prediction_model.ipynb` notebook is constructed. Follow this guide if you want to manually recreate the model, add new features, or change the prediction window.

---

## 1. Environment Setup
Before starting, ensure you have the necessary research libraries installed:
```bash
pip install pandas numpy matplotlib seaborn scikit-learn joblib
```

---

## 2. Step-by-Step Construction

### Step 1: Data Ingestion
We load four JSON files into Pandas DataFrames.
*   **Crucial Rule**: Always use `pd.to_datetime` on the `date` columns immediately after loading. Without this, time-series sorting and feature engineering will fail.
*   **Aggregation**: Hospital cases are individual records. You must group them by `zone_id` and `date` to get a daily count before merging with weather data.

### Step 2: The "Merged" DataFrame
Merge all data on `['zone_id', 'date']`. 
*   **Handling NaNs**: Use `.ffill().bfill()` on the risk scores. In real-world data, some days might be missing a score; filling ensures the model has a continuous signal to learn from.

### Step 3: Advanced Feature Engineering (The "Secret Sauce")
This is where the accuracy comes from. When creating these, always iterate **per zone** to avoid mixing data from different locations:

1.  **Seasonality**:
    ```python
    df['month'] = df['date'].dt.month
    df['is_monsoon'] = df['month'].isin([6, 7, 8, 9])
    ```
2.  **Interaction Terms**:
    ```python
    df['heat_humidity_index'] = df['temperature_avg'] * df['humidity_avg']
    ```
3.  **EWMA (Trend Tracking)**:
    Use `.ewm(span=7).mean()`. This is better than simple rolling means because it reacts faster to recent spikes in disease cases.

### Step 4: The Forecasting Shift (Target Generation)
To predict 7 days into the future, we shift the risk score backwards:
```python
group['target_risk_7d'] = group['composite_score'].shift(-7)
```
*   **Tip**: If you want to predict 14 days ahead, change this to `-14`.

### Step 5: Training with Time-Series Integrity
**Never use `train_test_split`**. Since outbreaks happen in a sequence, we must use `TimeSeriesSplit`.
*   **Model**: We use `GradientBoostingRegressor` with `loss='huber'`. The Huber loss is the "magic" that prevents the model from being confused by temporary reporting errors or data spikes.

---

## 3. How to Modify the Model

### A. Adding a New Feature
1.  Add the logic in the **Feature Engineering** cell of the notebook.
2.  Add the new column name to the `features` list in the **Model Training** cell.
3.  Run the training cell and check the **Feature Importance** plot to see if your new feature actually helps.

### B. Changing the Prediction Window
If you want to predict **14 days** instead of 7:
1.  In the Feature Engineering section, change `.shift(-7)` to `.shift(-14)`.
2.  Rename the target column to `target_risk_14d` for clarity.
3.  Update the `y = df['target_risk_14d']` assignment.

### C. Improving Performance (Hyperparameter Tuning)
In the `GradientBoostingRegressor` call, you can tweak:
*   `n_estimators`: Increase (e.g., 500) for more complexity (slower).
*   `learning_rate`: Decrease (e.g., 0.01) for more stable learning (requires more estimators).
*   `max_depth`: Increase (e.g., 7) to capture more complex interactions (careful with overfitting).

---

## 4. Manual Deployment
Once you are happy with the model in the notebook:
1.  Run the final cell to export `risk_predictor.joblib`.
2.  Copy this file to `backend/models/`.
3.  Ensure the `backend/app/ml/preprocessor.py` has the **exact same feature engineering logic** as your notebook, or the model will fail in production.

---

## 5. Troubleshooting
*   **Error: `NaNs found in X`**: Ensure you call `.dropna()` or `.fillna(0)` after generating features and targets. Shifting and rolling always create NaNs at the edges of the dataset.
*   **Accuracy is 1.0 (Too perfect)**: This usually means "Data Leakage." Check if you accidentally included the `composite_score` of the *same* day in your features.
