import React from "react";
import ListMovies from "./AllMovies";
import { getPopularMovies } from "../../../common/api/movie";
import { ICredentials, IQueryMovies } from "../../../common/interfaces";

const Popular: React.FC = (): React.ReactElement => {
  const getMovies = (credentials: ICredentials) => async (obj: IQueryMovies) =>
    await getPopularMovies(obj.page, credentials);

  return (
    <React.Fragment>
      <ListMovies getMovies={getMovies} title={"Popular Movies"} />
    </React.Fragment>
  );
};

export default Popular;
