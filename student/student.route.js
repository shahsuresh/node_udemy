import express from "express";
import Student from "./student.model.js";
import { addStudentValidationSchema } from "./student.validation.js";
import { paginationDataValidationSchema } from "./student.validation.js";
import mongoose from "mongoose";
import { validateMongoIdFromParams } from "../middlewares/validateMongoId.js";
import { validateStudentDataFromReqBody } from "./student.middleware.js";

const router = express.Router();

//? add student route

// router.post("/student/add", async (req, res) => {
//   // extract new student from req.body
//   const newStudent = req.body;

//   // validate new student using yup
//   let validateData;
//   try {
//     validateData = await addStudentValidationSchema.validate(newStudent);
//   } catch (error) {
//     // if validation fails, throw error
//     return res.status(400).send({ message: error.message });
//   }

//   // check if user with provided email already exists

//   const student = await Student.findOne({ email: newStudent.email });
//   console.log(student);

//   // if user exists, throw error
//   if (student) {
//     return res.status(409).send({ message: "Email already exists" });
//   }

//   // create user
//   await Student.create(newStudent);

//   // send response
//   res.status(200).send({ message: "new Student added.", newStudent });
// });

//?=======same code to add new student using middleware concept=============

// SYNTAX ==> router.post("/student/add",(req,res,next)=>{},(req,res)=>{});
router.post(
  "/student/add",
  async (req, res, next) => {
    // extract new student from req.body
    const newStudent = req.body;

    try {
      // validate new student
      const validatedData = await addStudentValidationSchema.validate(
        newStudent
      );

      req.body = validatedData;
      // call next function
      next();
    } catch (error) {
      // if validation fails, throw error
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract new student from req.body
    const newStudent = req.body;

    // check if email already used
    const studentEmail = await Student.findOne({ email: newStudent.email });

    // if email already occupied, throw error
    if (studentEmail) {
      return res.status(409).send({ message: "Email already exists." });
    }

    // create user
    await Student.create(newStudent);

    // send response
    return res
      .status(201)
      .send({ message: "New Student is added successfully." });
  }
);

//? get student list

router.get(
  "/student/list",
  async (req, res, next) => {
    // extract pagination data from req.body
    const paginationData = req.body;
    let validateData;
    try {
      // validate pagination data
      validateData = await paginationDataValidationSchema.validate(
        paginationData
      );
      req.body = validateData;

      // call next function
      next();
    } catch (error) {
      // if validation fails,throw error
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract pagination data from req.body
    const paginationData = req.body;
    // calculate skip "(page-1)*limit"
    const skip = (paginationData.page - 1) * paginationData.limit;
    //find student
    const studentList = await Student.aggregate([
      { $match: {} },
      { $skip: skip },
      { $limit: paginationData.limit },
      { $project: { firstName: 1, lastName: 1, email: 1 } },
    ]);
    //send response
    res.status(200).send({ message: studentList });
  }
);

//?===delete student=======

router.delete(
  "/student/delete/:id",
  validateMongoIdFromParams,
  async (req, res) => {
    // extract studentId from req.params
    const studentId = req.params.id;
    // find student by ID
    const requiredStudent = await Student.findOne({ _id: studentId });
    // if student not found,throw error
    if (!requiredStudent) {
      return res.status(404).send({ message: "Student does not exist" });
    }
    // delete student

    await Student.deleteOne({ _id: studentId });
    // send response
    return res.status(200).send({ message: "Student is deleted successfully" });
  }
);
//?===get student details by ID====
router.get(
  "/student/details/:id",
  validateMongoIdFromParams,
  async (req, res) => {
    //extract student id from req.params
    const studentId = req.params.id;
    // find student in db
    const student = await Student.findOne({ _id: studentId });
    //if student not found,throw error
    if (!student) {
      return res.status(404).send({ message: "Student doesn't exist" });
    }
    // send student as response
    return res
      .status(200)
      .send({ message: "Success", studentDetails: student });
  }
);

//? ===update student details ====
router.put(
  "/student/edit/:id",
  validateMongoIdFromParams,
  validateStudentDataFromReqBody,
  async (req, res) => {
    // extract id from req.params
    const studentId = req.params.id;
    // extract new values from req.body
    const newValues = req.body;
    //find student by ID
    const student = await Student.findOne({ _id: studentId });
    //if not student, throw error
    if (!student) {
      return res.status(400).send({ message: "Student doesn't exist" });
    }
    // update student details
    await Student.updateOne({ _id: studentId }, { $set: { ...newValues } });
    //send response
    return res.status(200).send({ message: "Student is updated successfully" });
  }
);
export default router;
