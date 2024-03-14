import { addStudentValidationSchema } from "./student.validation.js";

export const validateStudentDataFromReqBody = async (req, res, next) => {
  // extract new values from req.body
  const newValues = req.body;
  //validate new values
  try {
    const validateData = await addStudentValidationSchema.validate(newValues);
    req.body = validateData;
    next();
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};
