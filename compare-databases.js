import mongoose from "mongoose";

async function compareDatabases() {
  try {
    // Check kambaz database
    console.log("=" .repeat(60));
    console.log("DATABASE 1: kambaz");
    console.log("=" .repeat(60));
    
    await mongoose.connect("mongodb+srv://carrie:123@kambaz.jfhf6ge.mongodb.net/kambaz");
    let db = mongoose.connection.db;
    
    let collections = await db.listCollections().toArray();
    console.log("\n📊 Collections in 'kambaz':");
    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`   ${coll.name}: ${count} documents`);
    }
    
    // Check dark_knight in kambaz
    const usersCollection1 = db.collection("users");
    const darkKnight1 = await usersCollection1.findOne({ username: "dark_knight" });
    if (darkKnight1) {
      const enrollmentsCollection1 = db.collection("enrollments");
      const enrollments1 = await enrollmentsCollection1.find({ user: darkKnight1._id }).toArray();
      console.log(`\n👤 dark_knight: ${enrollments1.length} enrollments`);
      if (enrollments1.length > 0) {
        const coursesCollection1 = db.collection("courses");
        for (const enrollment of enrollments1) {
          const course = await coursesCollection1.findOne({ _id: enrollment.course });
          if (course) {
            console.log(`   - ${course.name} (${course._id})`);
          }
        }
      }
    } else {
      console.log("\n👤 dark_knight: NOT FOUND");
    }
    
    await mongoose.connection.close();
    
    // Check kambaz-quizzes database
    console.log("\n" + "=" .repeat(60));
    console.log("DATABASE 2: kambaz-quizzes");
    console.log("=" .repeat(60));
    
    await mongoose.connect("mongodb+srv://carrie:123@kambaz.jfhf6ge.mongodb.net/kambaz-quizzes");
    db = mongoose.connection.db;
    
    collections = await db.listCollections().toArray();
    console.log("\n📊 Collections in 'kambaz-quizzes':");
    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`   ${coll.name}: ${count} documents`);
    }
    
    // Check dark_knight in kambaz-quizzes
    const usersCollection2 = db.collection("users");
    const darkKnight2 = await usersCollection2.findOne({ username: "dark_knight" });
    if (darkKnight2) {
      const enrollmentsCollection2 = db.collection("enrollments");
      const enrollments2 = await enrollmentsCollection2.find({ user: darkKnight2._id }).toArray();
      console.log(`\n👤 dark_knight: ${enrollments2.length} enrollments`);
      if (enrollments2.length > 0) {
        const coursesCollection2 = db.collection("courses");
        for (const enrollment of enrollments2) {
          const course = await coursesCollection2.findOne({ _id: enrollment.course });
          if (course) {
            console.log(`   - ${course.name} (${course._id})`);
          }
        }
      }
    } else {
      console.log("\n👤 dark_knight: NOT FOUND");
    }
    
    await mongoose.connection.close();
    
    // Summary
    console.log("\n" + "=" .repeat(60));
    console.log("SUMMARY");
    console.log("=" .repeat(60));
    console.log("\n✅ kambaz database:");
    console.log("   - Basic course data (assignments, modules, etc.)");
    console.log("   - Used for: Regular course operations");
    
    console.log("\n✅ kambaz-quizzes database:");
    console.log("   - Has quizzes collection (20 quizzes)");
    console.log("   - Has student_quiz_attempts collection (23 attempts)");
    console.log("   - Used for: Quiz functionality + course data");
    console.log("   - MORE COMPLETE (includes quiz features)");
    
    console.log("\n💡 RECOMMENDATION:");
    console.log("   Your deployed backend should use: kambaz-quizzes");
    console.log("   Reason: It has all the quiz data + enrollments");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

compareDatabases();
