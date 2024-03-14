import mongoose from "mongoose";
export const validateMongoIdFromParams = (req, res, next) => {
  // extract studentId from req.params
  const studentId = req.params.id;
  //check for mongo ID validity
  const isValidMongoId = mongoose.isValidObjectId(studentId);
  // if not valid id,throw error
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo ID" });
  }
  // call next function
  next();
};
