import mongoose from "mongoose";

const MONGODB_URL = "mongodb+srv://carrie:123@kambaz.jfhf6ge.mongodb.net/kambaz";

async function cleanupAndPrepare() {
  try {
    console.log("🔄 Step 1: Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URL);
    console.log("✅ Connected to MongoDB Atlas successfully\n");

    const db = mongoose.connection.db;

    // Step 2: Drop the enrollments collection
    console.log("🔄 Step 2: Dropping enrollments collection...");
    try {
      await db.dropCollection("enrollments");
      console.log("✅ Enrollments collection dropped successfully\n");
    } catch (error) {
      if (error.message.includes("ns not found")) {
        console.log("ℹ️  Enrollments collection didn't exist, skipping\n");
      } else {
        throw error;
      }
    }

    // Step 3: Create new enrollments collection with proper schema
    console.log("🔄 Step 3: Creating new enrollments collection...");
    await db.createCollection("enrollments");
    console.log("✅ Enrollments collection created\n");

    // Step 4: Create indexes
    console.log("🔄 Step 4: Creating indexes...");
    const enrollmentsCollection = db.collection("enrollments");

    // Index 1: user field
    console.log("   Creating index on 'user' field...");
    await enrollmentsCollection.createIndex({ user: 1 });
    console.log("   ✅ Index 'user_1' created");

    // Index 2: course field
    console.log("   Creating index on 'course' field...");
    await enrollmentsCollection.createIndex({ course: 1 });
    console.log("   ✅ Index 'course_1' created");

    // Index 3: Unique compound index on user + course
    console.log("   Creating unique compound index on 'user' + 'course'...");
    await enrollmentsCollection.createIndex(
      { user: 1, course: 1 },
      { unique: true }
    );
    console.log("   ✅ Index 'user_1_course_1' (UNIQUE) created\n");

    // Step 5: Verify indexes
    console.log("🔄 Step 5: Verifying all indexes...");
    const indexes = await enrollmentsCollection.listIndexes().toArray();
    console.log("📋 Indexes created:");
    indexes.forEach((index) => {
      console.log(`   - ${index.name}`);
    });
    console.log();

    console.log("✅ All done! MongoDB Atlas is ready for data import.\n");
    console.log("📌 Next steps:");
    console.log("   1. Export your local MongoDB data using mongodump or MongoDB Compass");
    console.log("   2. Import to MongoDB Atlas using mongorestore or MongoDB Compass");
    console.log("   3. Your deployed app on Render will automatically have access to the data\n");

    await mongoose.connection.close();
    console.log("🔌 Connection closed\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

cleanupAndPrepare();
