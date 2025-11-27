import mongoose from "mongoose";
import usersData from "./Kambaz/Database/users.js";
import coursesData from "./Kambaz/Database/courses.js";
import modulesData from "./Kambaz/Database/modules.js";
import assignmentsData from "./Kambaz/Database/assignments.js";
import enrollmentsData from "./Kambaz/Database/enrollments.js";

const ATLAS_MONGODB = "mongodb+srv://carrie:123@kambaz.jfhf6ge.mongodb.net/kambaz";

async function seedData() {
  try {
    console.log("🌱 Seeding MongoDB Atlas with Professor's Data\n");
    console.log("=" .repeat(50));

    // Step 1: Connect to MongoDB Atlas
    console.log("\n🔄 Step 1: Connecting to MongoDB Atlas...");
    const connection = mongoose.createConnection(ATLAS_MONGODB);
    await connection.asPromise();
    console.log("✅ Connected to MongoDB Atlas\n");

    const db = connection.db;

    // Step 2: Clear existing collections
    console.log("🔄 Step 2: Clearing existing collections...");
    const collections = ["users", "courses", "modules", "assignments", "enrollments"];
    for (const collName of collections) {
      await db.collection(collName).deleteMany({});
      console.log(`   ✅ Cleared ${collName}`);
    }
    console.log();

    // Step 3: Import Users
    console.log("🔄 Step 3: Importing users...");
    const usersCollection = db.collection("users");
    const usersResult = await usersCollection.insertMany(usersData);
    console.log(`   ✅ Inserted ${usersResult.insertedCount} users\n`);

    // Step 4: Import Courses
    console.log("🔄 Step 4: Importing courses...");
    const coursesCollection = db.collection("courses");
    const coursesResult = await coursesCollection.insertMany(coursesData);
    console.log(`   ✅ Inserted ${coursesResult.insertedCount} courses\n`);

    // Step 5: Import Modules
    console.log("🔄 Step 5: Importing modules...");
    const modulesCollection = db.collection("modules");
    const modulesResult = await modulesCollection.insertMany(modulesData);
    console.log(`   ✅ Inserted ${modulesResult.insertedCount} modules\n`);

    // Step 6: Import Assignments
    console.log("🔄 Step 6: Importing assignments...");
    const assignmentsCollection = db.collection("assignments");
    const assignmentsResult = await assignmentsCollection.insertMany(assignmentsData);
    console.log(`   ✅ Inserted ${assignmentsResult.insertedCount} assignments\n`);

    // Step 7: Import Enrollments
    console.log("🔄 Step 7: Importing enrollments...");
    const enrollmentsCollection = db.collection("enrollments");
    const enrollmentsResult = await enrollmentsCollection.insertMany(enrollmentsData, {
      ordered: false,
    });
    console.log(`   ✅ Inserted ${enrollmentsResult.insertedCount} enrollments\n`);

    // Step 8: Verify Data
    console.log("🔄 Step 8: Verifying data...\n");
    for (const collName of collections) {
      const count = await db.collection(collName).countDocuments();
      console.log(`   📋 ${collName}: ${count} documents`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("\n✅ Seeding Complete!\n");
    console.log("📌 Your MongoDB Atlas now has the professor's data.");
    console.log("📌 All collections are populated and ready to use.\n");

    await connection.close();
    console.log("🔌 Connection closed\n");
  } catch (error) {
    console.error("\n❌ Seeding Error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

seedData();
