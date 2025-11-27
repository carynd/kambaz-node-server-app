import mongoose from "mongoose";

const ATLAS_MONGODB = "mongodb+srv://carrie:123@kambaz.jfhf6ge.mongodb.net/kambaz";

async function resetDatabase() {
  try {
    console.log("\n🔄 Resetting MongoDB Atlas Database\n");
    console.log("=" .repeat(50));

    const connection = mongoose.createConnection(ATLAS_MONGODB);
    await connection.asPromise();
    console.log("\n✅ Connected to MongoDB Atlas");

    const db = connection.db;
    const collections = ["users", "courses", "modules", "assignments", "enrollments"];

    console.log("\n🔄 Dropping all collections...\n");

    for (const collName of collections) {
      try {
        await db.dropCollection(collName);
        console.log(`   ✅ Dropped ${collName}`);
      } catch (error) {
        if (error.message.includes("ns not found")) {
          console.log(`   ℹ️  ${collName} doesn't exist (skipped)`);
        } else {
          throw error;
        }
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("\n✅ Database Reset Complete!\n");
    console.log("📌 Options:");
    console.log("   1. Run 'node seed-mongodb-atlas.js' to reload professor's data");
    console.log("   2. Or manually add data through the app\n");

    await connection.close();
  } catch (error) {
    console.error("\n❌ Reset Error:", error.message);
    process.exit(1);
  }
}

resetDatabase();
