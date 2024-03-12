import express from "express";
import Course from "./course.model.js";
import { courseValidationSchema } from "./course.validation.js";
import mongoose from "mongoose";
import { paginationDataValidationSchema } from "./course.validation.js";

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
//? ====Edit course by id=======

router.put("/course/edit/:id", async (req, res) => {
  // extract course id from req.params
  const courseId = req.params.id;

  // check for valid mongoose ID
  const isValidMongoId = mongoose.isValidObjectId(courseId);
  //if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Not Valid mongo ID" });
  }
  // find course by id
  const course = await Course.findOne({ _id: courseId });

  // if not course, throw error
  if (!course) {
    return res.status(400).send({ message: "Course does not exist" });
  }

  //extract new values from req.body

  const newValues = req.body;

  //validate new Values
  try {
    await courseValidationSchema.validate(newValues);
  } catch (error) {
    //if validation failed, throw error
    return res.status(400).send({ message: error.message });
  }

  //edit course
  await Course.updateOne({ _id: courseId }, { $set: { ...newValues } });
  //send response
  res.status(201).send({ message: "Course Updated Successfully" });
});

//? delete course by id
router.delete("/course/delete/:id", async (req, res) => {
  // extract course id from req.params
  const courseId = req.params.id;

  // check for valid mongoose ID
  const isValidMongoId = mongoose.isValidObjectId(courseId);
  //if not valid mongo id, throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Not Valid mongo ID" });
  }
  // find course by id
  const course = await Course.findOne({ _id: courseId });

  // if not course, throw error
  if (!course) {
    return res.status(400).send({ message: "Course does not exist" });
  }
  //delete course by id

  await Course.deleteOne({ _id: courseId });
  //send response
  return res.status(200).send({ message: " Course deleted Successfully" });
});

//? ==get course list==

router.get("/course/list", async (req, res) => {
  // extract pagination data from req.body
  const paginationData = req.body;
  let validateData;

  try {
    // validate pagination data
    validateData = await paginationDataValidationSchema.validate(
      paginationData
    );
  } catch (error) {
    // if validation fails,throw error
    return res.status(400).send({ message: error.message });
  }
  // calculate skip "(page-1)*limit"
  const skip = (validateData.page - 1) * validateData.limit;
  // find courses
  const courseList = await Course.aggregate([
    { $match: {} },
    { $skip: skip },
    { $limit: validateData.limit },
    { $project: { name: 1, price: 1, duration: 1 } },
  ]);
  // send response

  return res.status(200).send({ message: courseList });
});
export default router;
