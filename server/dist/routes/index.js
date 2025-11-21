"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Note: Removed auth, user, post, and file routes since they're not needed
// for the core domestic violence safety app functionality
exports.default = router;
//# sourceMappingURL=index.js.map