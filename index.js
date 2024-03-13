import express from "express";
import connectDB from "./connect.db.js";
import courseRoutes from "./course/course.route.js";
import studentRoutes from "./student/student.route.js";

const app = express();

//? === make app understand json
app.use(express.json());

//? ====connect database======
connectDB();
//? ====register routes====

app.use(courseRoutes);
app.use(studentRoutes);

//?==== server and port=======
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server is at http://localhost:${PORT}`);
});
