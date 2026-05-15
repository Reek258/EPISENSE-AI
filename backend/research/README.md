# EPISENCE Research & ML
This directory contains research notebooks and experimental models for the EPISENCE epidemiological dashboard.

## Contents
- `risk_prediction_model.ipynb`: Primary research notebook for ward-level risk forecasting using Random Forest and Meteorological data.

## How to use
1. Ensure you have the required dependencies installed:
   ```bash
   pip install pandas numpy scikit-learn matplotlib seaborn joblib
   ```
2. Open the notebook in VS Code or Jupyter:
   ```bash
   jupyter notebook research/risk_prediction_model.ipynb
   ```
3. Run all cells to train the model and export it to the `backend/models/` directory.

## Model Details
- **Algorithm**: Random Forest Regressor
- **Features**: Average Temperature, Humidity, Rainfall, Wind Speed, Historical Case Count, 7-day Rolling Weather averages.
- **Target**: Predicted `composite_score` for the next 7 days.
