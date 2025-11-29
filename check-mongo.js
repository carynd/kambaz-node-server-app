import mongoose from "mongoose";

const ATLAS_MONGODB = "mongodb+srv://carrie:123@kambaz.jfhf6ge.mongodb.net/kambaz";

async function checkData() {
  try {
    const connection = mongoose.createConnection(ATLAS_MONGODB);
    await connection.asPromise();

    const db = connection.getClient().db('kambaz');

    // Check courses collection
    console.log("\n=== COURSES IN MONGODB ===\n");
    const courses = await db.collection('courses').find({}).toArray();
    courses.forEach(course => {
      console.log(`\nCourse: ${course._id} - ${course.name}`);
      console.log(`Fields: ${Object.keys(course).join(', ')}`);
      if (course.modules) {
        console.log(`  ⚠️  Has 'modules' array with ${course.modules.length} items`);
        console.log(`  Content: ${JSON.stringify(course.modules).substring(0, 150)}...`);
      } else {
        console.log(`  ✓ No 'modules' field`);
      }
    });

    console.log("\n\n=== MODULES IN MONGODB ===\n");
    const modules = await db.collection('modules').find({}).toArray();
    console.log(`Total modules: ${modules.length}`);
    modules.slice(0, 3).forEach(mod => {
      console.log(`\nModule: ${mod._id} - ${mod.name}`);
      console.log(`Course: ${mod.course}`);
      console.log(`Fields: ${Object.keys(mod).join(', ')}`);
    });

    await connection.close();
  } catch (err) {
    console.error("Error:", err.message);
  }
}

checkData();
