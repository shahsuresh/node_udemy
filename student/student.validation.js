import Yup from "yup";
export const addStudentValidationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is Required")
    .trim()
    .max(30, "firstname must be at max 30 characters"),
  lastName: Yup.string()
    .required()
    .trim()
    .max(30, "lastname must be at max 30 characters"),
  email: Yup.string()
    .email("Must be a valid email")
    .required()
    .max(65, "Email must be at must 65 characters")
    .trim()
    .lowercase(),
  contactNumber: Yup.string()
    .trim()
    .min(7, "Contact number must be at least 7 characters")
    .max(15, "Contact number must be at max 15 characters"),
  isGraduated: Yup.boolean(),
});

export const paginationDataValidationSchema = Yup.object({
  page: Yup.number().positive().required().min(1, "Page must be at least 1"),
  limit: Yup.number().default(6).min(1, "Limit must be at least 1."),
});
