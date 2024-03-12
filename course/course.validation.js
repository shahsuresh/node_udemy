import Yup from "yup";

export const courseValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required()
    .max(45, "Name must be at max 45 characters."),
  duration: Yup.number().min(1, "Duration must be at least 1 day.").required(),
  price: Yup.number().min(0, "Price must be at least 0.").required(),
  tutorName: Yup.string()
    .trim()
    .max(45, "Tutor name must be at max 45 characters."),
});
