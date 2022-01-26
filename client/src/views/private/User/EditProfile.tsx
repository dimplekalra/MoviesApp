import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../../common/utility";
import { getUser, updateUser } from "../../../common/api/user";
import { useNavigate } from "react-router-dom";
import { validateInputs, signupSchema } from "../../../common/validateInputs";
import Input from "../../../controls/Input";
import stateContext, { ContextProps } from "../../../context/state-context";
import Loader from "../../../controls/Loader";

export interface IUserState {
  fullName: string;
  email: string;
}

export interface IUserError {
  isError: boolean;
  fullName: string;
  email: string;
}

const userInitialState = {
  fullName: "",
  email: "",
};

const EditProfile: React.FC = () => {
  const [user, setUser] = useState<IUserState>(userInitialState);
  const [errors, setErrors] = useState<IUserError>({
    isError: false,
    fullName: "",
    email: "",
  });

  const [authError, setAuthError] = useState<string>("");
  const context = useContext(stateContext) as ContextProps;

  const history = useNavigate();

  useEffect(() => {
    context.init();
    fetchUser();
  }, []);

  const fetchUser: () => Promise<void> = async () => {
    try {
      const jwt = auth.isAuthenticated();

      if (!jwt) history("/signin");

      context.setAPIState({
        ...context.APIStatus,
        InProgress: true,
      });

      const result = await getUser({ t: jwt.accessToken, r: jwt.refreshToken });

      context.setAPIState({
        ...context.APIStatus,
        InProgress: false,
        Failed: false,
        FailMessage: "",
      });

      const data = result.data;

      if (data) {
        setUser({ fullName: data.name, email: data.email });
      } else throw new Error(result.error);
    } catch (error: any) {
      context.setAPIState({
        ...context.APIStatus,
        InProgress: false,
        Failed: true,
        FailMessage: error.message,
      });
      setAuthError(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "email": {
        setUser({
          ...user,
          email: value,
        });
        break;
      }
      case "fullName": {
        setUser({
          ...user,
          fullName: value,
        });
        break;
      }

      default:
        return;
    }
  };

  const handleBlur = async (
    e: React.FocusEvent<HTMLInputElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const { name, value } = e.target;

      const errorObj = await validateInputs(signupSchema, name, value);

      const { isError, errorMessage } = errorObj;

      if (isError) {
        setErrors({
          ...errors,
          isError: true,

          [name]: errorMessage,
        });
      } else {
        setErrors({
          ...errors,
          isError: false,

          [name]: "",
        });
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const { email, fullName } = user;

    const nameError = await validateInputs(signupSchema, "fullName", fullName);
    const emailError = await validateInputs(signupSchema, "email", email);

    if (nameError.isError || emailError.isError) {
      setErrors({
        ...errors,
        isError: true,
        fullName: nameError.isError ? nameError.errorMessage : "",
        email: emailError.isError ? emailError.errorMessage : "",
      });
      return;
    } else {
      try {
        const jwt = auth.isAuthenticated();
        if (!jwt) throw new Error("User is not authenticated");

        context.setAPIState({
          ...context.APIStatus,
          InProgress: true,
        });

        let data = {
          name: user.fullName,
          email: user.email,
        };

        const result = await updateUser(
          {
            t: jwt.accessToken,
            r: jwt.refreshToken,
          },
          data
        );

        context.setAPIState({
          ...context.APIStatus,
          InProgress: false,
          Failed: false,
          FailMessage: "",
        });

        if (result.error) setAuthError(result.error);
        else setAuthError("");

        setUser({ ...userInitialState });
        setErrors({
          ...errors,
          isError: false,
        });

        history("/");
      } catch (error: any) {
        setUser({ ...userInitialState });
        setErrors({
          ...errors,
          isError: true,
        });
        context.setAPIState({
          ...context.APIStatus,
          InProgress: false,
          Failed: true,
          FailMessage: error.message,
        });
      }
    }
  };

  const { fullName, email } = user;

  const { APIStatus } = context;
  return (
    <div className="row">
      <div className="col s12 ">
        <div className="row">
          <div className="col s12 m6 offset-m3">
            <form action="" className="card form" onSubmit={handleSubmit}>
              <div className="card-content ">
                <div className="card-title">
                  <h3 className="center-align">Edit User</h3>
                </div>

                {APIStatus.InProgress ? (
                  <div className="col s12 center-align">
                    <Loader />
                  </div>
                ) : null}

                <div className="row">
                  <div className="col s12 input-field">
                    <Input
                      type="text"
                      onChange={handleChange}
                      name="fullName"
                      id="Full Name"
                      value={fullName}
                      important={true}
                      onBlur={handleBlur}
                      disabled={APIStatus.InProgress}
                      error={errors.fullName}
                      icon="person"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col s12 input-field">
                    <Input
                      type="email"
                      onChange={handleChange}
                      name="email"
                      id="Email"
                      value={email}
                      important={true}
                      disabled={APIStatus.InProgress}
                      onBlur={handleBlur}
                      error={errors.email}
                      icon="email"
                    />
                  </div>
                </div>
                {authError || authError.trim().length ? (
                  <p className="red-text center">{authError}</p>
                ) : null}
              </div>
              <div className="card-action">
                <div className="row center">
                  <button
                    className="btn waves-effect waves-light submit red "
                    type="submit"
                    disabled={errors.isError || APIStatus.InProgress}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
