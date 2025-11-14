# SilentVoice+ Setup Guide

## Prerequisites

- Node.js 18+ and npm
- MongoDB 6.0+ (local or cloud instance)
- Git

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

### 2. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string

### 3. Environment Configuration

#### Server Environment
Create `server/.env` file:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/silentvoice
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### Client Environment
Create `client/.env` file:
```env
VITE_SOCKET_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
```

### 4. Optional Service Integrations

#### Twilio (SMS/Voice Alerts)
1. Sign up at https://www.twilio.com
2. Get Account SID, Auth Token, and Phone Number
3. Add to `server/.env`:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number
```

#### Email (SMTP)
1. Configure SMTP settings (Gmail, SendGrid, etc.)
2. Add to `server/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### Google Maps API
1. Get API key from https://console.cloud.google.com
2. Add to `server/.env`:
```env
GOOGLE_MAPS_API_KEY=your_api_key
```

### 5. Start Development Servers

```bash
# Start both server and client concurrently
npm run dev

# Or start separately:
npm run server  # Backend on http://localhost:5000
npm run client  # Frontend on http://localhost:3000
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Production Deployment

### Build for Production

```bash
# Build client
cd client
npm run build

# Build server
cd ../server
npm run build
```

### Production Environment Variables

Ensure all environment variables are set with production values:
- Use strong JWT_SECRET
- Use production MongoDB URI
- Configure all service APIs
- Set NODE_ENV=production

### Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Use HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable helmet security headers
- [ ] Use environment variables for all secrets
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Test emergency response protocols
- [ ] Train staff on system usage

## Testing

```bash
# Run tests
npm test
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in .env
- Verify network/firewall settings

### Port Already in Use
- Change PORT in server/.env
- Update CLIENT_URL accordingly

### Socket.io Connection Issues
- Check VITE_SOCKET_URL in client/.env
- Verify CORS settings in server
- Check firewall settings

## Support

For issues and questions, please refer to the main README.md or contact the development team.

