import joblib
import os
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
import numpy as np

class ModelManager:
    def __init__(self, model_dir: str):
        self.model_dir = model_dir
        self.model_path = os.path.join(model_dir, "risk_predictor.joblib")
        self.model = None

    def train(self, X, y):
        # Time-series cross validation is CRITICAL for accurate output in temporal data
        # It prevents the model from "cheating" by looking at the future
        tscv = TimeSeriesSplit(n_splits=5)
        
        print("Starting Time-Series Cross Validation...")
        
        maes = []
        r2s = []
        
        # Use Gradient Boosting for better accuracy than Random Forest on tabular data
        self.model = GradientBoostingRegressor(
            n_estimators=200,
            learning_rate=0.05,
            max_depth=5,
            random_state=42,
            loss='huber' # Robust to outliers (outbreaks)
        )

        # Cross-validation loop
        for train_index, test_index in tscv.split(X):
            X_train, X_test = X.iloc[train_index], X.iloc[test_index]
            y_train, y_test = y.iloc[train_index], y.iloc[test_index]
            
            self.model.fit(X_train, y_train)
            preds = self.model.predict(X_test)
            
            maes.append(mean_absolute_error(y_test, preds))
            r2s.append(r2_score(y_test, preds))

        # Final fit on all data
        self.model.fit(X, y)
        
        avg_mae = np.mean(maes)
        avg_r2 = np.mean(r2s)
        
        print(f"Cross-validated MAE: {avg_mae:.2f}")
        print(f"Cross-validated R2: {avg_r2:.2f}")
        
        # Save
        os.makedirs(self.model_dir, exist_ok=True)
        joblib.dump(self.model, self.model_path)
        print(f"Model saved to {self.model_path}")
        
        return avg_mae, avg_r2

    def load_model(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            return True
        return False

    def predict(self, features_df):
        if self.model is None:
            if not self.load_model():
                raise Exception("Model not trained or loaded")
        
        predictions = self.model.predict(features_df)
        # Ensure accurate output by clipping values to valid risk range [0, 100]
        return np.clip(predictions, 0, 100)

    def get_feature_importance(self, feature_names):
        if self.model is None:
            if not self.load_model():
                return None
        
        importances = self.model.feature_importances_
        return dict(zip(feature_names, importances))
