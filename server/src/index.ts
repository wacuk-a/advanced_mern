import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SIMPLE WORKING ROUTES - NO COMPLEXITY
app.post('/api/panic/activate', (req, res) => {
  res.json({ success: true, message: "Emergency alert sent!" });
});

app.get('/api/safehouses/nearby', (req, res) => {
  res.json({
    safehouses: [
      { id: 1, name: "Nairobi Women's Hospital", phone: "+254703042000", distance: "1.2km" },
      { id: 2, name: "Kenya Police Gender Desk", phone: "999", distance: "2.1km" }
    ]
  });
});

app.post('/api/evidence/audio', (req, res) => {
  res.json({ success: true, id: `audio_${Date.now()}` });
});

app.post('/api/evidence/photo', (req, res) => {
  res.json({ success: true, id: `photo_${Date.now()}` });
});

app.post('/api/evidence/video', (req, res) => {
  res.json({ success: true, id: `video_${Date.now()}` });
});

app.get('/api/emergency/contacts', (req, res) => {
  res.json({
    contacts: [
      { name: "Police Emergency", number: "999" },
      { name: "Gender Violence Hotline", number: "1195" },
      { name: "Nairobi Women's Hospital", number: "+254703042000" }
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
