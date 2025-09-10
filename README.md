# Hostel Complaint Management System
A MERN-stack project with **Apache Kafka** for message queuing, an **ML model** for complaint priority classification, and role-based access control (Student, Worker, Admin).

---

## Tech Stack
- **Frontend**: React + Tailwind CSS  
- **Backend**: Node.js + Express + MongoDB + KafkaJS  
- **Message Queue**: Apache Kafka + Zookeeper (via Docker)  
- **ML Model**: Python (Flask, Scikit-learn, Joblib)  
- **Image Upload**: Cloudinary + Multer  

---

## Project Structure
```
HCMSystemDesign/
│
├── backend/                # Node.js Express backend
│   ├── kafka/              # Kafka producer/consumer scripts
│   ├── ml/                 # ML service (Flask API + model)
│   └── ...                 # Other backend files
│
├── frontend/               # React frontend
│
├── docker-compose.yml      # Kafka + Zookeeper setup
└── README.md
```

---

## How to Run

### 1. Prerequisites
Make sure you have installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)  
- [Node.js](https://nodejs.org/) (v18+ recommended)  
- [Python](https://www.python.org/) (3.9+ recommended)  
- [pip](https://pip.pypa.io/en/stable/)  
- MongoDB (local or cloud like Atlas)

---

### 2. Start Kafka & Zookeeper
From the project root:
```
docker compose up -d
```
This will start:
- Zookeeper on port 2181
- Kafka broker on port 9092

Check if containers are running:
```
docker ps
```

### 3. Start the ML Service
In a new terminal:
```
cd backend/ml
pip install -r requirements.txt
python predict_api.py
```
Expected output:
```
* Running on http://127.0.0.1:5000
```

### 4. Start the Backend
In a new terminal:
```
cd backend
npm install
npm start
```
Backend will run on:
```
http://localhost:4000
```

### 5. Start the Frontend
In a new terminal:
```
cd frontend
npm install
npm start
```
Frontend will run on:
```
http://localhost:3000
```

## Startup Order
```
Docker Desktop → docker compose up -d(you should run the docker engine in your local machine)
ML Service → python predict_api.py
Backend → npm start
Frontend → npm run dev
```
