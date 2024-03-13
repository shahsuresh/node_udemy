import mongoose from "mongoose";

//set rule
const studentSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 30 },
    lastName: { type: String, required: true, trim: true, maxlength: 30 },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
      lowercase: true,
      unique: true, //index
    },
    contactNumber: {
      type: String,
      required: false,
      trim: true,
      minlength: 7,
      maxlength: 15,
    },
    isGraduated: { type: Boolean, required: false },
  },
  {}
);

//create collection/table/model

const Student = mongoose.model("Student", studentSchema);

export default Student;
