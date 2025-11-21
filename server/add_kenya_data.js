const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb://localhost:27017/silentvoice";

const kenyaSafehouses = [
  {
    name: "Nairobi Women's Shelter",
    location: {
      latitude: -1.2921,
      longitude: 36.8219,
      address: "Moi Avenue, Nairobi CBD, Nairobi"
    },
    capacity: 40,
    availableSpots: 8,
    resources: ["emergency_shelter", "food", "counseling", "medical", "legal_aid"],
    contact: {
      phone: "+254-720-123456",
      email: "nairobi@silentvoice.co.ke"
    },
    securityLevel: "high",
    isActive: true,
    features: ["24/7_staff", "security_cameras", "private_rooms", "child_friendly"],
    county: "Nairobi"
  },
  {
    name: "Mombasa Safe Haven",
    location: {
      latitude: -4.0435,
      longitude: 39.6682,
      address: "Nyerere Road, Mombasa"
    },
    capacity: 25,
    availableSpots: 3,
    resources: ["emergency_shelter", "counseling", "support_groups", "medical"],
    contact: {
      phone: "+254-734-567890",
      email: "mombasa@silentvoice.co.ke"
    },
    securityLevel: "medium",
    isActive: true,
    features: ["24/7_staff", "security_fence", "women_only"],
    county: "Mombasa"
  },
  {
    name: "Kisumu Peace Center",
    location: {
      latitude: -0.1022,
      longitude: 34.7617,
      address: "Oginga Odinga Road, Kisumu"
    },
    capacity: 35,
    availableSpots: 15,
    resources: ["emergency_shelter", "food", "counseling", "legal_aid", "children_services"],
    contact: {
      phone: "+254-757-901234",
      email: "kisumu@silentvoice.co.ke"
    },
    securityLevel: "high",
    isActive: true,
    features: ["24/7_staff", "play_area", "counseling_rooms", "secure_entrance"],
    county: "Kisumu"
  },
  {
    name: "Eldoret Protection Home",
    location: {
      latitude: 0.5143,
      longitude: 35.2698,
      address: "Uganda Road, Eldoret"
    },
    capacity: 20,
    availableSpots: 6,
    resources: ["emergency_shelter", "medical", "counseling", "temporary_housing"],
    contact: {
      phone: "+254-723-345678",
      email: "eldoret@silentvoice.co.ke"
    },
    securityLevel: "medium",
    isActive: true,
    features: ["24/7_staff", "garden", "community_kitchen"],
    county: "Uasin Gishu"
  },
  {
    name: "Nakuru Safety House",
    location: {
      latitude: -0.3031,
      longitude: 36.0800,
      address: "Kenyatta Avenue, Nakuru"
    },
    capacity: 28,
    availableSpots: 4,
    resources: ["emergency_shelter", "food", "counseling", "legal_aid", "job_training"],
    contact: {
      phone: "+254-711-234567",
      email: "nakuru@silentvoice.co.ke"
    },
    securityLevel: "high",
    isActive: true,
    features: ["24/7_staff", "security_guards", "training_rooms", "library"],
    county: "Nakuru"
  }
];

async function addSampleData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db();
    const safehousesCollection = db.collection('safehouses');
    
    // Clear existing safehouses
    await safehousesCollection.deleteMany({});
    console.log("Cleared existing safehouses");
    
    // Insert Kenya safehouses
    const result = await safehousesCollection.insertMany(kenyaSafehouses);
    console.log(`✅ Added ${result.insertedCount} Kenya safehouses to database`);
    
    console.log("\n📋 Sample Safehouses Added:");
    kenyaSafehouses.forEach(sh => {
      console.log(`🏠 ${sh.name} - ${sh.county} (${sh.availableSpots} spots available)`);
    });
    
  } catch (error) {
    console.error("Error adding sample data:", error);
  } finally {
    await client.close();
  }
}

addSampleData();
