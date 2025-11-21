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
exports.Safehouse = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SafehouseSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    ngoId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'NGO',
        required: true,
        index: true
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: String,
        country: { type: String, required: true },
        coordinates: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true }
        }
    },
    contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
        emergencyPhone: String
    },
    capacity: {
        totalBeds: { type: Number, required: true, min: 0 },
        availableBeds: { type: Number, default: 0, min: 0 },
        reservedBeds: { type: Number, default: 0, min: 0 },
        occupiedBeds: { type: Number, default: 0, min: 0 }
    },
    resources: {
        food: {
            available: { type: Boolean, default: true },
            capacity: { type: Number, default: 0 },
            currentStock: { type: Number, default: 0 }
        },
        medical: {
            available: { type: Boolean, default: false },
            staffOnSite: { type: Boolean, default: false },
            equipment: [String]
        },
        legal: {
            available: { type: Boolean, default: false },
            services: [String]
        },
        counseling: {
            available: { type: Boolean, default: true },
            services: [String]
        },
        transportation: {
            available: { type: Boolean, default: false },
            vehicles: { type: Number, default: 0 }
        }
    },
    amenities: [String],
    securityLevel: {
        type: String,
        enum: ['standard', 'high', 'maximum'],
        default: 'standard'
    },
    accessibility: {
        wheelchairAccessible: { type: Boolean, default: false },
        petFriendly: { type: Boolean, default: false },
        childrenFriendly: { type: Boolean, default: true },
        lgbtqFriendly: { type: Boolean, default: true }
    },
    availability: {
        isAvailable: { type: Boolean, default: true },
        lastUpdated: { type: Date, default: Date.now },
        nextAvailableDate: Date
    },
    staff: [{
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            role: String,
            shift: String
        }],
    bookings: [{
            bookingId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SafehouseBooking' },
            checkInDate: Date,
            checkOutDate: Date,
            status: {
                type: String,
                enum: ['pending', 'approved', 'checked_in', 'checked_out', 'cancelled'],
                default: 'pending'
            }
        }]
}, {
    timestamps: true
});
// Indexes
SafehouseSchema.index({ ngoId: 1, 'availability.isAvailable': 1 });
SafehouseSchema.index({ 'address.coordinates.latitude': 1, 'address.coordinates.longitude': 1 });
SafehouseSchema.index({ 'capacity.availableBeds': 1 });
exports.Safehouse = mongoose_1.default.model('Safehouse', SafehouseSchema);
//# sourceMappingURL=Safehouse.js.map