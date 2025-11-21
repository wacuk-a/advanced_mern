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
exports.SafehouseBooking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SafehouseBookingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    anonymousSessionId: {
        type: String,
        index: true
    },
    safehouseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Safehouse',
        required: true,
        index: true
    },
    requestedCheckIn: {
        type: Date,
        required: true
    },
    requestedCheckOut: Date,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'checked_in', 'checked_out', 'cancelled'],
        default: 'pending',
        index: true
    },
    numberOfGuests: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    specialNeeds: [String],
    transportationRequired: {
        type: Boolean,
        default: false
    },
    transportationDetails: {
        pickupLocation: {
            latitude: Number,
            longitude: Number,
            address: String
        },
        scheduledTime: Date,
        status: {
            type: String,
            enum: ['pending', 'scheduled', 'in_transit', 'completed', 'cancelled'],
            default: 'pending'
        },
        distance: Number, // in kilometers
        estimatedTravelTime: Number // in minutes
    },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: Date,
    checkedInAt: Date,
    checkedOutAt: Date,
    checkedInBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: String,
    workflowStep: {
        type: Number,
        min: 1,
        max: 6
    },
    needsAssessment: {
        medicalNeeds: [String],
        legalNeeds: [String],
        counselingNeeds: [String],
        foodAssistance: Boolean,
        clothingAssistance: Boolean,
        documentationHelp: Boolean,
        safetyConcerns: [String]
    },
    supportServices: {
        medical: Boolean,
        legal: Boolean,
        counseling: Boolean,
        food: Boolean,
        transportation: Boolean,
        assignedServices: [{
                serviceType: String,
                providerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
                scheduledDate: Date,
                status: {
                    type: String,
                    enum: ['pending', 'active', 'completed'],
                    default: 'pending'
                }
            }]
    }
}, {
    timestamps: true
});
// Indexes
SafehouseBookingSchema.index({ status: 1, createdAt: -1 });
SafehouseBookingSchema.index({ safehouseId: 1, status: 1 });
exports.SafehouseBooking = mongoose_1.default.model('SafehouseBooking', SafehouseBookingSchema);
//# sourceMappingURL=SafehouseBooking.js.map