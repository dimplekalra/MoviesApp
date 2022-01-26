import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { IAcceptAll } from "../common/interfaces";

interface IProps {
  Component: React.ReactNode;
}

const withRouter: Function =
  (Component: any): React.FC<IProps> =>
  (props: IAcceptAll) => {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    return (
      <Component
        {...props}
        params={params}
        location={location}
        history={navigate}
      />
    );
  };

export default withRouter;
