import React from "react";
import ListMovies from "./AllMovies";
import { getFavouriteMovies } from "../../../common/api/movie";
import { ICredentials, IQueryMovies } from "../../../common/interfaces";

const Favourites: React.FC = (): React.ReactElement => {
  const getMovies = (credentials: ICredentials) => async (obj: IQueryMovies) =>
    await getFavouriteMovies(credentials, obj);

  return (
    <React.Fragment>
      <ListMovies getMovies={getMovies} title="Favourites Movies" />
    </React.Fragment>
  );
};

export default Favourites;
