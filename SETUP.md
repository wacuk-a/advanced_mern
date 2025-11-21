# 🚀 Project Setup Guide

## Prerequisites
- **Node.js** 16+ 
- **MongoDB** database (local or Atlas)
- **Git** for version control

## 📋 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/wacuk-a/advanced_mern.git
cd advanced_mern
2. Backend Setup
bash
cd server

# Install dependencies
npm install

# Create environment file
cat > .env << 'ENV'
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
JWT_SECRET_RESET=your_jwt_reset_secret_here
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
ENV

# Development
npm run dev

# Production build
npm run build
npm start
3. Frontend Setup
bash
cd ../client

# Install dependencies
npm install

# Create environment file
cat > .env << 'ENV'
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
ENV

# Development
npm run dev

# Production build
npm run build
🛠️ Development Commands
Backend (Server)
bash
cd server
npm run dev          # Development with hot reload
npm run build        # Build for production
npm start           # Start production server
npm test            # Run tests
Frontend (Client)
bash
cd client
npm run dev          # Development server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
🌐 Deployment
Backend to Render.com
Connect GitHub repository to Render

Set root directory to server

Add environment variables:

MONGODB_URI

JWT_SECRET

JWT_SECRET_RESET

NODE_ENV=production

Frontend to Vercel
Connect GitHub repository to Vercel

Set root directory to client

Build command: npm run build

Output directory: dist

Environment variables:

VITE_API_URL (your Render backend URL)

VITE_SOCKET_URL (your Render backend URL)

🔧 Environment Variables
Backend (.env)
env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_here
JWT_SECRET_RESET=your_jwt_reset_secret_here
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
Frontend (.env)
env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
🐛 Troubleshooting
Common Issues
Backend not starting: Check MongoDB connection string

Frontend build errors: Clear node_modules and reinstall

CORS errors: Ensure CLIENT_URL matches frontend URL

Environment variables: Verify all required variables are set

Development Tips
Use browser DevTools to debug API calls

Check server logs for backend errors

Test both development and production builds

Verify all environment variables are correctly set

📞 Support
For issues during setup, check:

Console errors in browser DevTools

Server logs in terminal

Network tab for failed API calls

MongoDB connection status
