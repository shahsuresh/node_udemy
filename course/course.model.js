import mongoose from "mongoose";

//? set rules

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 45,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      min: 1,
      required: true,
    },
    tutorName: {
      type: String,
      required: false,
      maxLength: 45,
      trim: true,
    },
  },
  { timestamps: true }
);

//? Create table

const Course = mongoose.model("Course", courseSchema);

//? export Course

export default Course;
