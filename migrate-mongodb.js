import mongoose from "mongoose";

const LOCAL_MONGODB = "mongodb://localhost:27017/kambaz";
const ATLAS_MONGODB = "mongodb+srv://carrie:123@kambaz.jfhf6ge.mongodb.net/kambaz";

// Collections to migrate
const COLLECTIONS = ["users", "courses", "modules", "enrollments"];

async function migrateData() {
  let localConnection, atlasConnection;

  try {
    console.log("📊 MongoDB Migration Script Started\n");
    console.log("=" .repeat(50));

    // Step 1: Connect to local MongoDB
    console.log("\n🔄 Step 1: Connecting to local MongoDB...");
    localConnection = mongoose.createConnection(LOCAL_MONGODB);
    await localConnection.asPromise();
    console.log("✅ Connected to local MongoDB\n");

    // Step 2: Connect to MongoDB Atlas
    console.log("🔄 Step 2: Connecting to MongoDB Atlas...");
    atlasConnection = mongoose.createConnection(ATLAS_MONGODB);
    await atlasConnection.asPromise();
    console.log("✅ Connected to MongoDB Atlas\n");

    // Step 3: Export and import each collection
    console.log("🔄 Step 3: Migrating collections...\n");

    for (const collectionName of COLLECTIONS) {
      console.log(`   📥 Migrating '${collectionName}' collection...`);

      const localDB = localConnection.db;
      const atlasDB = atlasConnection.db;

      // Get local collection
      const localCollection = localDB.collection(collectionName);
      const count = await localCollection.countDocuments();

      if (count === 0) {
        console.log(`      ℹ️  No documents found, skipping\n`);
        continue;
      }

      // Export data from local
      const documents = await localCollection.find({}).toArray();
      console.log(`      Found ${count} documents`);

      // Import to Atlas
      const atlasCollection = atlasDB.collection(collectionName);

      // Delete existing docs in Atlas (clean slate)
      await atlasCollection.deleteMany({});
      console.log(`      Cleared existing data in Atlas`);

      // Insert documents
      const result = await atlasCollection.insertMany(documents, {
        ordered: false,
      });
      console.log(`      ✅ Inserted ${result.insertedCount} documents\n`);
    }

    // Step 4: Verify data
    console.log("🔄 Step 4: Verifying migrated data...\n");

    for (const collectionName of COLLECTIONS) {
      const atlasDB = atlasConnection.db;
      const atlasCollection = atlasDB.collection(collectionName);
      const count = await atlasCollection.countDocuments();
      console.log(`   📋 ${collectionName}: ${count} documents`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("\n✅ Migration Complete!\n");
    console.log("📌 Your MongoDB Atlas now has all your data.");
    console.log("📌 Your deployed app on Render will show the data.\n");

    // Close connections
    await localConnection.close();
    await atlasConnection.close();
    console.log("🔌 Connections closed\n");
  } catch (error) {
    console.error("\n❌ Migration Error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateData();
