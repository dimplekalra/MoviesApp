import { object, string, ref } from "yup";

export const createUserSchema = object({
  body: object({
    name: string().required("Name is Required"),
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum."),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "Passwords must match"
    ),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});

export const createUserSessionSchema = object({
  body: object({
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum."),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});

const params = {
  params: object({
    userId: string().required("movie Title is required"),
  }),
};

export const updateUserSchema = object({
  body: object({
    name: string().required("Name is Required"),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});

export const removeUserSchema = object({
  ...params,
});
