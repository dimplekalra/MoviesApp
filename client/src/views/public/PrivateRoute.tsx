import React, { ReactElement } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { IAcceptAll } from "../../common/interfaces";
import { auth } from "../../common/utility";
const PrivateRoute: React.FC<IAcceptAll> = (): ReactElement => {
  const location = useLocation();

  if (auth.isAuthenticated()) {
    return <Outlet />;
  }

  return <Navigate to="/signin" state={{ from: location }} />;
};
export default PrivateRoute;
