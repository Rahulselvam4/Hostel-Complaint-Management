# 🏠 HostelMate – Complaint Management System for Hostels

HostelMate is a real-time, full-stack complaint management system built specifically for hostel environments. It bridges communication between students, workers, and admin to resolve issues faster and more efficiently — all under one smart interface.
--------
## 🚀 Features

### 🎓 For Students
- 📝 Submit new complaints
- 📜 View history of submitted complaints

### 🛠️ For Workers
- 📂 View complaints filtered by category (e.g., Electrical, Plumbing)
- ✅ Update status once a complaint is resolved

### 👨‍💼 For Admin
- 🕵️ View all complaints
- 🗓️ Identify unresolved complaints older than 7 days
- ➕ Add new workers to the system
- 📢 Post announcements to students

---

## 🧱 Tech Stack

| Layer         | Tech                             |
|---------------|----------------------------------|
| Frontend      | React.js + Tailwind CSS          |
| Backend       | Node.js + Express                |
| Database      | MongoDB                          |
| Auth          | JWT                              |
| Tools         | GitHub, VS Code                  |

---

## 📂 File Structure
hostelmate/ │ 
├── frontend/ # React + Tailwind │ 
├── public/ │ 
└── src/ │ 
├── components/ │ 
├── pages/ │ 
├── routes/ │ 
└── ... │ 
├── backend/ │
├── student-api/ # Microservice: student operations │
├── worker-api/ # Microservice: worker operations │ 
├── admin-api/ # Microservice: admin operations │ 
└── shared/ # Auth, DB utils, middlewares │
└── README.md



---

## 🥪 Local Setup

### 🔧 Prerequisites:
- Node.js (v18+)
- MongoDB
- Git

### ⚙️ Installation

# 1. Clone the repo
git clone git@github.com:your-org/hostelmate.git

# 2. Move into the project
cd hostelmate

# 3. Install frontend dependencies
cd frontend && npm install

# 4. Install backend services
cd ../backend/student-api && npm install
cd ../worker-api && npm install
cd ../admin-api && npm install

🌐 Run Locally
# Start the frontend
cd frontend && npm run dev

# Start student backend service
cd backend/student-api && npm run dev

# Start worker backend service
cd backend/worker-api && npm run dev

# Start admin backend service
cd backend/admin-api && npm run dev


# 🧑‍💻 Team
### HostelMate Dev Team:

🎨 Janani Sri – Frontend Developer

🧠 Rahul – Backend Developer

🔗 Kathir – Full Stack Integration

# 📄 License
This project is licensed under the MIT License.

# 💬 Feedback & Contributions
Found a bug? Have an idea?
Open an issue or start a discussion — let’s collaborate with HostelMate!

   
