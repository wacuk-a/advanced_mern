# SilentVoice+ 🛡️

A comprehensive AI-powered platform for gender-based violence prevention, reporting, and support management with advanced safety features.

## 🚀 Features

### Core Modules

1. **Advanced Panic Button System**
   - One-touch emergency activation
   - Multi-modal triggers (shake, double-press, voice)
   - Real-time GPS tracking
   - Automated emergency notifications
   - Evidence recording

2. **Safehouse Management System**
   - Real-time availability tracking
   - Secure booking system
   - Resource management
   - Transportation coordination

3. **Safe Mode & Digital Safety**
   - Quick exit button
   - Incognito mode
   - Screenshot prevention
   - Digital footprint minimization

4. **Intelligent Reporting System**
   - Multi-modal AI analysis
   - Risk assessment scoring
   - Anonymous user profiles

5. **Advanced Counselor Dashboard**
   - AI-powered case prioritization
   - Real-time panic button monitoring
   - Emergency response coordination

6. **Real-time Communication Suite**
   - End-to-end encrypted messaging
   - Emergency video verification
   - Secure file sharing

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io + WebRTC
- **API**: JSON-RPC 2.0
- **PWA**: Offline functionality with service workers

## 📦 Installation

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Build for production
npm run build
```

## 🔐 Security Features

- Military-grade encryption for all data
- Anonymous user sessions
- Secure location data handling
- Emergency data wipe capabilities
- Compliance with domestic violence shelter security protocols

## 📝 Environment Variables

### Server (.env in `server/` directory)

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/silentvoice

# JWT Secret (CHANGE IN PRODUCTION)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Twilio Configuration (for SMS/voice alerts)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# Google Maps API (for safehouse locations)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# AI Service (optional - for advanced AI features)
AI_SERVICE_URL=https://api.openai.com/v1
AI_SERVICE_KEY=your_ai_service_key

# Emergency Services API (optional)
EMERGENCY_SERVICES_API_URL=https://api.emergency-services.com
EMERGENCY_SERVICES_API_KEY=your_emergency_services_key
```

### Client (.env in `client/` directory)

```env
VITE_SOCKET_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
```

## 🚨 Emergency Response

This platform includes critical safety features. Ensure proper training and protocols are in place before deployment.

## 📄 License

MIT

