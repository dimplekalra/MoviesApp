import React, { useContext, useEffect, useState, Fragment } from "react";

import DeleteUser from "./DeleteUser";
import { auth } from "../../../common/utility";

import { getUser } from "../../../common/api/user";
import { RouteProps, useNavigate } from "react-router-dom";
import stateContext, { ContextProps } from "../../../context/state-context";
import Loader from "../../../controls/Loader";
import { IUser } from "../../../common/interfaces";

const userInitialState = {
  createdAt: "",
  email: "",
  name: "",
  updatedAt: "",
  _id: "",
};

interface IProps extends RouteProps {}

const Profile: React.FC<IProps> = (): React.ReactElement => {
  const [user, setUser] = useState<IUser>(userInitialState);
  const context = useContext(stateContext) as ContextProps;

  const history = useNavigate();

  const init = async (): Promise<void> => {
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
        Failed: false,
        FailMessage: "",
        InProgress: false,
      });

      const data = result.data;
      if (!data && result.error) {
        throw new Error("could not load user please try again later");
      }
      setUser({ ...data });
    } catch (error: any) {
      context.setAPIState({
        ...context.APIStatus,
        Failed: true,
        FailMessage: error.message,
        InProgress: false,
      });
    }
  };

  useEffect(() => {
    init();
  }, []);

  const { APIStatus } = context;

  const isAuth = auth.isAuthenticated();

  return (
    <Fragment>
      <div className="row user-profile-sec">
        <div className="col s12 ">
          {APIStatus.InProgress ? (
            <div className="col s12 center-align">
              <Loader />
            </div>
          ) : (
            <div className=" card">
              <div className="card-image">
                <img src={`${process.env.PUBLIC_URL}/person.jpg`} alt="" />
              </div>
              <div className="card-content">
                {!user ? null : (
                  <>
                    <span className="card-title grey-text darken-4">
                      {user.name}
                    </span>
                    <p className="flow-text">{user.email}</p>
                    <h6 className="grey-text darken-3">
                      {"Joined on " + new Date(user.createdAt).toDateString()}
                    </h6>
                  </>
                )}
              </div>
              <div className="card-action">
                {isAuth && user && user._id === (user ? user._id : null) ? (
                  <div className="row center-align">
                    <div className="col">
                      <button
                        onClick={() => history(`/user/edit`)}
                        className="btn-floating edit-button waves-effect waves-light"
                      >
                        {<i className="material-icons">edit</i>}
                      </button>
                    </div>
                    <div className="col del-btn">
                      <DeleteUser userId={user._id} />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;
