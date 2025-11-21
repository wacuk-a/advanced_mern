"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
require("dotenv/config"); // Load environment variables first
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const database_1 = require("./config/database");
const jsonrpc_1 = __importDefault(require("./routes/jsonrpc"));
const socketHandler_1 = __importDefault(require("./socket/socketHandler"));
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
exports.io = io;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/jsonrpc', jsonrpc_1.default);
// Socket.io
(0, socketHandler_1.default)(io);
// Connect to database
(0, database_1.connectDB)();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map