🎓 College Management System — Setup & Installation Guide
This project is a full-stack College Management System built with MERN Stack (MongoDB, Express.js, React.js, Node.js).

🚀 Prerequisites
Make sure the following tools are installed on your system:

Node.js (v14 or above)

npm (comes with Node.js)

Code Editor like VS Code

(Optional) MongoDB locally or use MongoDB Atlas

📁 Project Structure
sql
Copy
Edit
College-Management-System/
├── client/     → React frontend
├── backend/    → Express backend
🛠️ Installation Steps
1️⃣ Clone or Download the Project
You can either download the ZIP or clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/college-management-system.git
Then open the folder in VS Code or your preferred editor.

2️⃣ Backend Setup
bash
Copy
Edit
cd backend          # Navigate to backend folder
npm install         # Install backend dependencies
npm start           # Start the backend server
Your backend server should now be running (usually on http://localhost:5000).

3️⃣ Frontend Setup
Now go back to the main folder and open the frontend:

bash
Copy
Edit
cd ..               # Move back to the root directory
cd client           # Navigate to client folder
npm install         # Install frontend dependencies
npm run dev         # Start the frontend development server
The frontend will usually run at http://localhost:5173 (if using Vite).

🧠 Notes
Make sure MongoDB is running (locally or via cloud).

Configure the .env file in the backend folder with your MongoDB URI and JWT secret.
