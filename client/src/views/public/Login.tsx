import React, { Component } from "react";
import { signIn } from "../../common/api/auth";
import { Link, RouteProps } from "react-router-dom";
import Input from "../../controls/Input";
import { auth } from "../../common/utility";
import {
  validateInputs,
  validateSchema,
  loginSchema,
} from "../../common/validateInputs";
import stateContext from "../../context/state-context";
import Loader from "../../controls/Loader";
import { IAcceptAll, ILogin } from "../../common/interfaces";
import withRouter from "../../controls/withRouter";

interface IState {
  password: string;
  email: string;
  isError: boolean;
  authError: string;
  errors: {
    password: string;
    email: string;
  };
}

class SignIn extends Component<IAcceptAll & RouteProps, IState> {
  state = {
    password: "",
    email: "",
    isError: false,
    authError: "",
    errors: {
      password: "",
      email: "",
    },
  };

  static contextType = stateContext;

  handleBlur = async (e: React.FocusEvent<HTMLInputElement>): Promise<void> => {
    e.preventDefault();
    try {
      const { name, value } = e.target;

      const errorObj = await validateInputs(loginSchema, name, value);

      const { isError, errorMessage } = errorObj;

      if (isError) {
        this.setState({
          isError: true,
          errors: {
            ...this.state.errors,
            [name]: errorMessage,
          },
        });
      } else {
        this.setState({
          isError: false,
          errors: {
            ...this.state.errors,
            [name]: "",
          },
        });
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  clickSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { email, password } = this.state;
    const user = { email, password };

    try {
      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: true,
      });

      const errorObj = await validateSchema(loginSchema, { ...user });

      if (errorObj.isError) {
        throw new Error("Please fill out the Form Properly");
      }

      const result = await signIn(user);

      this.context.setAPIState({
        ...this.context.APIStatus,
        Failed: false,
        FailMessage: "",
        InProgress: false,
      });

      if (result.error) throw new Error(result.error);
      else this.setState({ authError: "" });
      const data: ILogin = result.data;

      // Need TO CHANGE HERE
      auth.authenticate({ ...data, timestamp: new Date() }, () => {});
      this.props.history("/");
    } catch (error: any) {
      this.context.setAPIState({
        ...this.context.APIStatus,
        Failed: true,
        FailMessage: error.message,
        InProgress: false,
      });
      this.setState({ authError: error.message });
    }
  };

  componentDidMount() {
    if (auth.isAuthenticated()) {
      const { history } = this.props;
      history("/");
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    switch (name) {
      case "password": {
        this.setState({
          password: value,
        });
        break;
      }
      case "email": {
        this.setState({
          email: value,
        });
        break;
      }
      default:
        return;
    }
  };

  render() {
    const { email, password, authError, errors, isError } = this.state;

    const { APIStatus } = this.context;

    return (
      <div className="row">
        <div className="col s12 m6 offset-m3">
          <form className="form card " onSubmit={this.clickSubmit}>
            <div className="card-content">
              <div className="card-title">
                <h2 className="center-align">Sign IN</h2>
              </div>
              {APIStatus.InProgress ? (
                <div className="col s12 center-align">
                  <Loader />
                </div>
              ) : null}
              <div className="row">
                <div className="col s12 input-field">
                  <Input
                    type="email"
                    onChange={this.handleChange}
                    name="email"
                    id="Email"
                    value={email}
                    important={true}
                    onBlur={this.handleBlur}
                    error={errors.email}
                    icon="email"
                    disabled={APIStatus.InProgress}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col s12 input-field">
                  <Input
                    type="password"
                    onChange={this.handleChange}
                    name="password"
                    id="Password"
                    value={password}
                    important={true}
                    onBlur={this.handleBlur}
                    error={errors.password}
                    icon="security"
                    disabled={APIStatus.InProgress}
                  />
                </div>
              </div>
              <br />{" "}
              {authError || authError.trim().length ? (
                <p className="red-text center">{authError}</p>
              ) : null}
            </div>

            <div className="card-action">
              <div className="row">
                <div className="col s12 align center">
                  <button
                    type="submit"
                    className="btn waves-effect waves-light submit align-center"
                    disabled={isError || APIStatus.InProgress}
                  >
                    Submit
                  </button>
                </div>
                <div className="col s12">
                  <p className="center new-user-sign">
                    New User? <Link to="/signup">Sign Up</Link>here
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(SignIn);
