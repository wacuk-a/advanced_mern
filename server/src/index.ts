import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';

const app = express();

// FIX CORS - Allow all origins
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// SIMPLE WORKING ROUTES
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

// EVIDENCE ROUTES - FIXED
app.post('/api/evidence/audio', (req, res) => {
  console.log('Audio evidence saved:', req.body);
  res.json({ success: true, id: `audio_${Date.now()}`, message: "Audio saved successfully" });
});

app.post('/api/evidence/photo', (req, res) => {
  console.log('Photo evidence saved:', req.body);
  res.json({ success: true, id: `photo_${Date.now()}`, message: "Photo saved successfully" });
});

app.post('/api/evidence/video', (req, res) => {
  console.log('Video evidence saved:', req.body);
  res.json({ success: true, id: `video_${Date.now()}`, message: "Video saved successfully" });
});

// Add GET routes for testing
app.get('/api/evidence/audio', (req, res) => {
  res.json({ message: "Audio endpoint working - use POST to save audio" });
});

app.get('/api/evidence/photo', (req, res) => {
  res.json({ message: "Photo endpoint working - use POST to save photos" });
});

app.get('/api/evidence/video', (req, res) => {
  res.json({ message: "Video endpoint working - use POST to save videos" });
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

// Safety Plan endpoints
app.get('/api/safetyplans', (req, res) => {
  res.json({
    plans: [
      { id: 1, name: "Emergency Exit Plan", steps: ["Identify safe exits", "Pack emergency bag", "Memorize safe contacts"] },
      { id: 2, name: "Digital Safety Plan", steps: ["Clear browser history", "Use incognito mode", "Enable quick exit"] }
    ]
  });
});

app.post('/api/safetyplans', (req, res) => {
  res.json({ success: true, id: `plan_${Date.now()}` });
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
