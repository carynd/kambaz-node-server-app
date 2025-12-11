import mongoose from "mongoose";

const MONGODB_URL = "mongodb+srv://carrie:123@kambaz.jfhf6ge.mongodb.net/kambaz-quizzes?retryWrites=true&w=majority";

async function checkDarkKnight() {
  try {
    console.log("Connecting to MongoDB Atlas (kambaz-quizzes database)...");
    await mongoose.connect(MONGODB_URL);
    console.log("✅ Connected!\n");

    const db = mongoose.connection.db;

    // Check users collection
    console.log("🔍 Checking users collection...");
    const usersCollection = db.collection("users");
    const darkKnight = await usersCollection.findOne({ username: "dark_knight" });
    
    if (!darkKnight) {
      console.log("❌ dark_knight user not found!");
      await mongoose.connection.close();
      return;
    }
    
    console.log("✅ Found dark_knight:");
    console.log(`   ID: ${darkKnight._id}`);
    console.log(`   Name: ${darkKnight.firstName} ${darkKnight.lastName}`);
    console.log(`   Email: ${darkKnight.email}\n`);

    // Check enrollments collection
    console.log("🔍 Checking enrollments for dark_knight...");
    const enrollmentsCollection = db.collection("enrollments");
    const enrollments = await enrollmentsCollection.find({ user: darkKnight._id }).toArray();
    
    console.log(`   Found ${enrollments.length} enrollments\n`);

    if (enrollments.length === 0) {
      console.log("❌ dark_knight is NOT enrolled in any courses!");
    } else {
      console.log("📚 dark_knight is enrolled in:");
      
      // Get course details for each enrollment
      const coursesCollection = db.collection("courses");
      for (const enrollment of enrollments) {
        const course = await coursesCollection.findOne({ _id: enrollment.course });
        if (course) {
          console.log(`   ✅ ${course.name} (${course._id})`);
        } else {
          console.log(`   ⚠️  Course ID: ${enrollment.course} (course not found in database)`);
        }
      }
    }

    // Show all collections and their counts
    console.log("\n📊 Database Statistics:");
    const collections = await db.listCollections().toArray();
    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`   ${coll.name}: ${count} documents`);
    }

    await mongoose.connection.close();
    console.log("\n🔌 Connection closed");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkDarkKnight();
