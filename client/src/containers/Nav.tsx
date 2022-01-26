import React from "react";
import { auth } from "../common/utility";
import {
  Link,
  NavLink,
  useNavigate,
  RouteProps,
  useLocation,
} from "react-router-dom";
import { signout } from "../common/api/auth";

const isActiveRoute = (pathname: string, path: string) => {
  if (pathname === path) return { color: "#f99085" };
  else return { color: "#efdcd5" };
};

interface IProps extends RouteProps {}

const Navbar: React.FC<IProps> = () => {
  const history = useNavigate();
  const location = useLocation();
  const handleSignOut = async () => {
    try {
      await auth.signOut(async () => {
        const jwt = auth.isAuthenticated();
        await signout({ t: jwt.accessToken, r: jwt.refreshToken });
      });
      history("/signin");
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div className="row navbar">
      <div className="col">
        <div className="full-height">
          <nav>
            <div className="logo-sec">
              <Link to="/" className="brand-logo">
                <i className="material-icons prefix">ondemand_video</i>
                YourTube
              </Link>
            </div>

            <div className="side-nav">
              <ul className="right ">
                {!auth.isAuthenticated() ? (
                  <span>
                    <li className="signout pad-top">
                      <NavLink
                        to="/signup"
                        style={({ isActive }) =>
                          isActiveRoute(location.pathname, "/signup")
                        }
                      >
                        Sign Up
                      </NavLink>
                    </li>
                    <li className="signin pad-top">
                      <NavLink
                        to="/signin"
                        style={({ isActive }) =>
                          isActiveRoute(location.pathname, "/signin")
                        }
                      >
                        Sign In
                      </NavLink>
                    </li>
                  </span>
                ) : null}
                {auth.isAuthenticated() ? (
                  <span>
                    <li>
                      <NavLink
                        to="/movies/favourite"
                        style={({ isActive }) =>
                          isActiveRoute(location.pathname, "/movie/favourite")
                        }
                      >
                        <i className="material-icons">favorite</i>
                        <span>Fav</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/movies/upcoming"
                        style={({ isActive }) =>
                          isActiveRoute(location.pathname, "/movie/upcoming")
                        }
                      >
                        <i className="material-icons">today</i>
                        <span>Upcoming</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/movies/popular"
                        style={({ isActive }) =>
                          isActiveRoute(location.pathname, "/movie/popular")
                        }
                      >
                        <i className="material-icons">whatshot</i>
                        <span>Popular</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        style={({ isActive }) =>
                          isActiveRoute(location.pathname, "/user")
                        }
                        to={"/user"}
                      >
                        <i className="material-icons">person</i>
                        My Profile
                      </NavLink>
                    </li>
                    <li>
                      <span color="inherit" onClick={handleSignOut}>
                        Sign out
                      </span>
                    </li>
                  </span>
                ) : null}
              </ul>
            </div>
          </nav>

          <ul className="sidenav" id="mobile-nav">
            {!auth.isAuthenticated() ? (
              <span>
                <li>
                  <Link
                    to="/signup"
                    style={isActiveRoute(location.pathname, "/signup")}
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signin"
                    style={isActiveRoute(location.pathname, "/signin")}
                  >
                    Sign In
                  </Link>
                </li>
              </span>
            ) : null}
            {auth.isAuthenticated() ? (
              <span>
                <li>
                  <NavLink
                    to="/movies/favourite"
                    style={({ isActive }) =>
                      isActiveRoute(location.pathname, "/movie/favourite")
                    }
                  >
                    <i className="material-icons">favorite</i>
                    <span>Fav</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/movies/upcoming"
                    style={({ isActive }) =>
                      isActiveRoute(location.pathname, "/movie/upcoming")
                    }
                  >
                    <i className="material-icons">today</i>
                    <span>Upcoming</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/movies/popular"
                    style={({ isActive }) =>
                      isActiveRoute(location.pathname, "/movie/popular")
                    }
                  >
                    <i className="material-icons">whatshot</i>
                    <span>Popular</span>
                  </NavLink>
                </li>
                <li>
                  <Link
                    style={isActiveRoute(location.pathname, "/user")}
                    to={"/user"}
                  >
                    <i className="material-icons">person</i>
                    My Profile
                  </Link>
                </li>
                <li>
                  <span color="inherit" onClick={handleSignOut}>
                    Sign out
                  </span>
                </li>
              </span>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
