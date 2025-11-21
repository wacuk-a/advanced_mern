"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
// ALL WORKING ROUTES
app.post('/api/panic', (req, res) => {
    res.json({ success: true, message: "🚨 Emergency alert sent to authorities!" });
});
app.get('/api/safehouses', (req, res) => {
    res.json({
        safehouses: [
            { id: 1, name: "Nairobi Women's Hospital", phone: "+254703042000", type: "hospital" },
            { id: 2, name: "Kenya Police", phone: "999", type: "police" },
            { id: 3, name: "Gender Violence Hotline", phone: "1195", type: "hotline" }
        ]
    });
});
app.post('/api/evidence', (req, res) => {
    res.json({ success: true, message: "Evidence saved securely!", id: Date.now() });
});
app.get('/api/contacts', (req, res) => {
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
//# sourceMappingURL=index.js.map