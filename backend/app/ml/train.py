import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.ml.preprocessor import DataPreprocessor
from app.ml.model_manager import ModelManager

def main():
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
    model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "models")
    
    print("Initializing Data Preprocessor...")
    preprocessor = DataPreprocessor(data_dir)
    
    print("Preparing training data...")
    X, y, features = preprocessor.prepare_training_data()
    
    print(f"Data prepared. Shape: {X.shape}")
    print(f"Features: {features}")
    
    print("Initializing Model Manager...")
    model_manager = ModelManager(model_dir)
    
    print("Starting training with Time-Series Cross Validation...")
    mae, r2 = model_manager.train(X, y)
    
    print("\nTraining process completed successfully.")
    print(f"Final Validation Metrics -> MAE: {mae:.2f}, R2: {r2:.2f}")
    
    # Analyze what drives the "accurate output"
    importances = model_manager.get_feature_importance(features)
    if importances:
        print("\nTop Features Driving Predictions:")
        sorted_features = sorted(importances.items(), key=lambda x: x[1], reverse=True)
        for feat, imp in sorted_features[:5]:
            print(f"- {feat}: {imp:.4f}")

if __name__ == "__main__":
    main()
