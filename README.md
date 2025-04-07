# MERN Social App

A full-stack social media application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Users can sign up, post updates, like/comment on posts, and interact with each other.

## 🚀 Features

- 🔐 User authentication with JWT
- 👤 User profile creation and management
- 📝 Create, edit, and delete posts
- 🖼️ Image upload with Cloudinary
- 🔔 Real-time notifications (Socket.IO)
- 📱 Responsive UI with modern design

---

## 🛠️ Tech Stack

**Frontend**:  
- React.js  
- Redux
- Framer Motion
- Axios

**Backend**:  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- Cloudinary  
- JWT  
- Socket.IO

---

## 📁 Folder Structure

mern-social-app/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.js
│       └── index.js
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── config/
├── .gitignore
├── README.md
└── package.json

# MERN Social App - Setup Script

```bash
# Clone the repository
git clone https://github.com/dinemo-lab/mern-social-app.git
cd mern-social-app

# Backend Setup
cd server
npm install

# Create .env file for backend
echo "MONGO_URI=your-mongodb-connection-string" > .env
echo "JWT_SECRET=your-jwt-secret" >> .env
echo "PORT=5000" >> .env

# Start the backend server
npm run dev

# Frontend Setup
cd ../client
npm install

# Create .env file for frontend
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Start the frontend server
npm start

# After setup, access the app at:
# http://localhost:3000
