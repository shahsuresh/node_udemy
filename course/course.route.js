import express from "express";
import Course from "./course.model.js";
import { courseValidationSchema } from "./course.validation.js";

const router = express.Router();

//?===== Course router=========
//? Add Course
router.post("/course/add", async (req, res) => {
  //extract new course from req.body
  const newCourse = req.body;
  try {
    await courseValidationSchema.validate(newCourse);
  } catch (error) {
    //console.log(error);
    return res.status(400).send({ message: error.message });
  }
  //insert course to database
  await Course.create(newCourse);
  //send response
  res
    .status(200)
    .send({ message: `new Course: ${newCourse.name} added Successfully` });
});
export default router;
