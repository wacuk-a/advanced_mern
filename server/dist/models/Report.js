"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ReportSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    anonymousSessionId: {
        type: String,
        index: true
    },
    reportType: {
        type: String,
        enum: ['incident', 'threat', 'harassment', 'abuse', 'other'],
        required: true
    },
    content: {
        text: String,
        images: [String],
        audio: String,
        video: String
    },
    location: {
        latitude: Number,
        longitude: Number,
        address: String,
        timestamp: { type: Date, default: Date.now }
    },
    incidentDate: Date,
    aiAnalysis: {
        riskScore: { type: Number, min: 0, max: 100 },
        riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical']
        },
        keywords: [String],
        sentiment: {
            type: String,
            enum: ['positive', 'neutral', 'negative', 'distressed']
        },
        explanation: String,
        analyzedAt: { type: Date, default: Date.now }
    },
    status: {
        type: String,
        enum: ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'archived'],
        default: 'submitted',
        index: true
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
        index: true
    },
    tags: [String],
    followUpRequired: {
        type: Boolean,
        default: false
    },
    followUpDate: Date,
    notes: [{
            addedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            content: String,
            timestamp: { type: Date, default: Date.now }
        }]
}, {
    timestamps: true
});
// Indexes
ReportSchema.index({ status: 1, priority: 1, createdAt: -1 });
ReportSchema.index({ assignedTo: 1, status: 1 });
ReportSchema.index({ 'aiAnalysis.riskLevel': 1, status: 1 });
exports.Report = mongoose_1.default.model('Report', ReportSchema);
//# sourceMappingURL=Report.js.map