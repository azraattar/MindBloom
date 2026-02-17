from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

# ===============================
# Flask App Setup
# ===============================
app = Flask(__name__)
CORS(app)  # allow React frontend to call this API

# ===============================
# Load Model & Assets (ONCE)
# ===============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "dyslexia_screening_model.pkl"))
features = joblib.load(os.path.join(BASE_DIR, "dyslexia_features.pkl"))
threshold = joblib.load(os.path.join(BASE_DIR, "dyslexia_threshold.pkl"))

print("✅ Dyslexia screening model loaded successfully")

# ===============================
# Health Check Route
# ===============================
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "OK",
        "message": "Dyslexia Screening API is running"
    })


# ===============================
# Prediction Route
# ===============================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Convert input to DataFrame
        input_df = pd.DataFrame([data])

        # Ensure correct feature order & fill missing
        input_df = input_df.reindex(columns=features, fill_value=0).astype(float)

        # Predict probability
        probability = model.predict_proba(input_df)[0, 1]

        # Risk interpretation (SCREENING, not diagnosis)
        if probability >= threshold:
            risk_level = "High Risk (Screening Recommended)"
        elif probability >= threshold * 0.7:
            risk_level = "Moderate Risk"
        else:
            risk_level = "Low Risk"

        response = {
            "dyslexia_risk_percentage": round(float(probability) * 100, 1),
            "risk_level": risk_level,
            "confidence": round(max(probability, 1 - probability) * 100, 1)
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===============================
# Run Server
# ===============================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
