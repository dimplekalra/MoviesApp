import * as yup from "yup";

interface IError {
  isError: boolean;
  errorMessage: string;
}

export const signupSchema = yup.object().shape({
  fullName: yup.string().required("Name is Required"),
  password: yup
    .string()
    .trim()
    .required("Password is required")
    .min(6, "Password is too short - should be 6 chars minimum."),
  confirmPassword: yup
    .string()
    .test("passwords-match", "Passwords must match", function (value) {
      if (
        !this.options ||
        !this.options.context ||
        !this.options.context.password
      )
        return false;

      return (
        this.path === "confirmPassword" &&
        this.options.context.password === value
      );
    }),
  // yup
  //   .string()
  //   .oneOf([yup.ref("password"), null], "Passwords must match"),
  // yup.string().when("email", (password, field) => {
  //   console.log("email", password, field, field.options);
  //   return password ? field.required().oneOf([yup.ref("password")]) : field;
  // }),
  // yup
  //   .string()
  //   .required("Please confirm your password")
  //   .when("password", {
  //     is: function (password: string, field: any) {
  //       console.log("password", password, field);
  //       return password && password.length > 0 ? true : false;
  //     },

  //     then: yup
  //       .string()
  //       .oneOf([yup.ref("password")], "Password doesn't match"),
  //   }),
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
});

export const loginSchema = yup.object({
  password: yup
    .string()
    .trim()
    .required("Password is required")
    .min(6, "Password is too short - should be 6 chars minimum."),
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
});

const validateObjectShapeWithObject = (schema: yup.AnySchema, obj2: object) => {
  const obj1 = schema.getDefault();
  for (let key in obj1) {
    if (!(key in obj2)) return false;
  }
  return true;
};

const validate = (
  schema: yup.AnySchema,
  name: string,
  value: string,
  pass?: string
) => {
  return schema
    .validateAt(name, { [name]: value }, { context: { password: pass } })
    .catch((err: any) => {
      return {
        isError: true,
        errorMessage: err.errors[0],
      };
    });
};

export const validateInputs = async (
  schema: yup.AnySchema,
  name: string,
  value: string,
  pass?: string
): Promise<IError> => {
  let errorObj: IError = {
    isError: false,
    errorMessage: "",
  };
  switch (name) {
    case "fullName": {
      errorObj = await validate(schema, name, value);
      break;
    }
    case "email": {
      errorObj = await validate(schema, name, value);
      break;
    }
    case "password": {
      errorObj = await validate(schema, name, value);
      break;
    }
    case "confirmPassword": {
      errorObj = await validate(schema, name, value, pass);

      break;
    }
    default: {
      errorObj = {
        ...errorObj,
        isError: false,
        errorMessage: "",
      };
    }
  }

  return errorObj;
};

export const validateSchema = async (
  schema: yup.AnySchema,
  data: any
): Promise<IError> => {
  let errorObj: IError = {
    isError: false,
    errorMessage: "",
  };

  if (!validateObjectShapeWithObject(schema, data)) {
    errorObj = {
      isError: true,
      errorMessage: "data is not aligned with object",
    };
    return errorObj;
  }

  if (schema && data) {
    await schema
      .validate(data, { context: { password: data.password } })
      .catch((err: any) => {
        errorObj = {
          ...errorObj,
          isError: true,
          errorMessage: err.errors,
        };
      });
  }
  return errorObj;
};
