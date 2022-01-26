import React, { Component } from "react";
import { Route, RouteProps, Routes } from "react-router-dom";
import Home from "../core/Home";

import Signup from "../views/public/Signup";
import Signin from "../views/public/Login";
import PrivateRoute from "../views/public/PrivateRoute";
import Profile from "../views/private/User/Profile";
import EditProfile from "../views/private/User/EditProfile";
import MovieDetails from "../views/private/Movies/MovieDetail";
import Favourites from "../views/private/Movies/Favourites";
import Upcoming from "../views/private/Movies/Upcoming";
import Popular from "../views/private/Movies/Popular";

interface IState {}

interface IProps extends RouteProps {}

class MainRouter extends Component<IProps, IState> {
  render() {
    return (
      <div>
        <Routes>
          {/**************  Home Route *****************/}
          <Route path="/" element={<Home />} />

          {/*************** Auth Routes ****************/}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {/*************** User Routes ****************/}
          <Route path="/user/edit" element={<PrivateRoute />}>
            <Route path="/user/edit" element={<EditProfile />} />
          </Route>

          <Route path="/user" element={<PrivateRoute />}>
            <Route path="/user" element={<Profile />} />
          </Route>

          {/*************** Movies Routes *************/}
          <Route path="/movies/movie/:movieId" element={<MovieDetails />} />

          <Route path="/movies/favourite" element={<PrivateRoute />}>
            <Route path="/movies/favourite" element={<Favourites />} />
          </Route>

          <Route path="/movies/upcoming" element={<PrivateRoute />}>
            <Route path="/movies/upcoming" element={<Upcoming />} />
          </Route>

          <Route path="/movies/popular" element={<PrivateRoute />}>
            <Route path="/movies/popular" element={<Popular />} />
          </Route>
        </Routes>
      </div>
    );
  }
}
export default MainRouter;
