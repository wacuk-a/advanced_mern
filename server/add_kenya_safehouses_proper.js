const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/silentvoice";

// Define the safehouse schema to match the controller
const safehouseSchema = new mongoose.Schema({
  name: String,
  address: {
    street: String,
    city: String,
    county: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  capacity: {
    totalBeds: Number,
    availableBeds: Number,
    reservedBeds: Number,
    occupiedBeds: Number
  },
  resources: [String],
  amenities: [String],
  securityLevel: String,
  accessibility: {
    wheelchairAccessible: Boolean,
    petFriendly: Boolean,
    childrenFriendly: Boolean
  },
  availability: {
    isAvailable: Boolean,
    nextAvailableDate: Date
  },
  contact: {
    phone: String,
    email: String
  },
  features: [String],
  isActive: Boolean
});

const Safehouse = mongoose.model('Safehouse', safehouseSchema);

const kenyaSafehouses = [
  {
    name: "Nairobi Women's Shelter",
    address: {
      street: "Moi Avenue, Nairobi CBD",
      city: "Nairobi",
      county: "Nairobi",
      coordinates: {
        latitude: -1.2921,
        longitude: 36.8219
      }
    },
    capacity: {
      totalBeds: 40,
      availableBeds: 8,
      reservedBeds: 2,
      occupiedBeds: 30
    },
    resources: ["emergency_shelter", "food", "counseling", "medical", "legal_aid"],
    amenities: ["private_rooms", "shared_kitchen", "counseling_rooms"],
    securityLevel: "high",
    accessibility: {
      wheelchairAccessible: true,
      petFriendly: false,
      childrenFriendly: true
    },
    availability: {
      isAvailable: true,
      nextAvailableDate: null
    },
    contact: {
      phone: "+254-720-123456",
      email: "nairobi@silentvoice.co.ke"
    },
    features: ["24/7_staff", "security_cameras", "private_rooms", "child_friendly"],
    isActive: true
  },
  {
    name: "Mombasa Safe Haven",
    address: {
      street: "Nyerere Road",
      city: "Mombasa",
      county: "Mombasa",
      coordinates: {
        latitude: -4.0435,
        longitude: 39.6682
      }
    },
    capacity: {
      totalBeds: 25,
      availableBeds: 3,
      reservedBeds: 1,
      occupiedBeds: 21
    },
    resources: ["emergency_shelter", "counseling", "support_groups", "medical"],
    amenities: ["shared_rooms", "garden", "meditation_space"],
    securityLevel: "medium",
    accessibility: {
      wheelchairAccessible: true,
      petFriendly: true,
      childrenFriendly: true
    },
    availability: {
      isAvailable: true,
      nextAvailableDate: null
    },
    contact: {
      phone: "+254-734-567890",
      email: "mombasa@silentvoice.co.ke"
    },
    features: ["24/7_staff", "security_fence", "women_only"],
    isActive: true
  }
];

async function addProperSafehouses() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing safehouses
    await Safehouse.deleteMany({});
    console.log("Cleared existing safehouses");

    // Insert proper safehouses
    const result = await Safehouse.insertMany(kenyaSafehouses);
    console.log(`✅ Added ${result.length} proper Kenya safehouses to database`);

    console.log("\n📋 Proper Safehouses Added:");
    result.forEach(sh => {
      console.log(`🏠 ${sh.name} - ${sh.address.county} (${sh.capacity.availableBeds} beds available)`);
    });

  } catch (error) {
    console.error("Error adding proper safehouses:", error);
  } finally {
    await mongoose.connection.close();
  }
}

addProperSafehouses();
