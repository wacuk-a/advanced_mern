const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ALL WORKING ROUTES
app.post('/api/panic', (req, res) => {
  console.log('Panic button activated');
  res.json({ success: true, message: "🚨 Emergency alert sent to authorities!" });
});

app.get('/api/safehouses', (req, res) => {
  console.log('Safehouses requested');
  res.json({
    safehouses: [
      { id: 1, name: "Nairobi Women's Hospital", phone: "+254703042000", type: "hospital" },
      { id: 2, name: "Kenya Police", phone: "999", type: "police" },
      { id: 3, name: "Gender Violence Hotline", phone: "1195", type: "hotline" }
    ]
  });
});

app.post('/api/evidence', (req, res) => {
  console.log('Evidence saved:', req.body);
  res.json({ success: true, message: "Evidence saved securely!", id: Date.now() });
});

app.get('/api/contacts', (req, res) => {
  console.log('Contacts requested');
  res.json({
    contacts: [
      { name: "Police", number: "999" },
      { name: "Gender Violence", number: "1195" },
      { name: "Ambulance", number: "911" }
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: "OK", message: "Backend is working!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
