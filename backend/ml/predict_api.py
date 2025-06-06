from flask import Flask, request, jsonify
import joblib
import traceback

app = Flask(__name__)

model = joblib.load("complaint_priority_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")
priority_encoder = joblib.load("priority_encoder.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        description = data["description"].lower()
        vector = vectorizer.transform([description])
        prediction = model.predict(vector)[0]
        priority = priority_encoder.inverse_transform([prediction])[0]
        print(f"Predicted priority: {priority} for description: {description}")
        return jsonify({"priority": priority})
    except Exception as e:
        return jsonify({"error": str(e), "trace": traceback.format_exc()})

if __name__ == "__main__":
    app.run(port=5001)
