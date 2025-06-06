import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
df = pd.read_csv("complaint_dataset.csv")

# Convert to lowercase
df['description'] = df['description'].str.lower()

# Encode labels
category_encoder = LabelEncoder()
priority_encoder = LabelEncoder()

df['issueCategory'] = category_encoder.fit_transform(df['issueCategory'])
df['priority'] = priority_encoder.fit_transform(df['priority'])

# Save encoders for later use
joblib.dump(category_encoder, "category_encoder.pkl")
joblib.dump(priority_encoder, "priority_encoder.pkl")

# Vectorize the description
vectorizer = TfidfVectorizer(stop_words='english', max_features=300)
X = vectorizer.fit_transform(df['description'])
y = df['priority']

# Save vectorizer
joblib.dump(vectorizer, "tfidf_vectorizer.pkl")

# Split into train and test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Save processed data
joblib.dump((X_train, y_train, X_test, y_test), "processed_data.pkl")

# Train the AI Model (Random Forest Classifier in this case)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, "complaint_priority_model.pkl")

print("✅ Preprocessing complete. Encoders, vectorizer, and model saved.")
