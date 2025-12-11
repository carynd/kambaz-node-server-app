import "dotenv/config";
import express from 'express'
import mongoose from "mongoose";
import Hello from "./Hello.js"
import Lab5 from './Lab5/index.js'
import cors from "cors";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import PeopleRoutes from "./Kambaz/Users/peopleRoutes.js";
import QuizzesRoutes from "./Kambaz/Quizzes/routes.js";
import session from "express-session";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);

const app = express()
app.use(cors(
    {
        credentials: true,
         origin: [
            process.env.CLIENT_URL || "http://localhost:3000",
            "https://kambaz-next-js-git-a6-caryns-projects-0f1dc0e2.vercel.app",
            "https://kambaz-next-js-git-feature-quizzes-caryns-projects-0f1dc0e2.vercel.app",
            /^https:\/\/kambaz-next-js-.*\.vercel\.app$/, // Allow all Vercel preview deployments
            "https://kambaz-next-js.vercel.app" // Production Vercel URL
        ],
    }
));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}
app.use(session(sessionOptions));

app.use(express.json());

// Diagnostic endpoint to check database connection
app.get("/api/diagnostic", async (req, res) => {
  try {
    const enrollmentsModel = mongoose.model("enrollments");
    const usersModel = mongoose.model("users");
    const coursesModel = mongoose.model("courses");

    const enrollmentCount = await enrollmentsModel.countDocuments();
    const userCount = await usersModel.countDocuments();
    const courseCount = await coursesModel.countDocuments();

    // Find dark_knight's enrollments
    const darkKnight = await usersModel.findOne({ username: "dark_knight" });
    const darkKnightEnrollments = darkKnight
      ? await enrollmentsModel.find({ user: darkKnight._id })
      : [];

    res.json({
      database: CONNECTION_STRING.includes("mongodb+srv") ? "MongoDB Atlas" : "Local MongoDB",
      connectionString: CONNECTION_STRING.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@"), // Hide password
      collections: {
        enrollments: enrollmentCount,
        users: userCount,
        courses: courseCount
      },
      darkKnight: darkKnight ? {
        id: darkKnight._id,
        username: darkKnight.username,
        enrollmentCount: darkKnightEnrollments.length,
        enrollments: darkKnightEnrollments
      } : "Not found"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);
PeopleRoutes(app, db);
QuizzesRoutes(app, db);
Lab5(app);
Hello(app);
app.listen(process.env.PORT || 4000)
