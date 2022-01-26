import React from "react";
import ListMovies from "./AllMovies";
import { getUpcomingMovies } from "../../../common/api/movie";
import { ICredentials, IQueryMovies } from "../../../common/interfaces";

const Upcoming: React.FC = (): React.ReactElement => {
  const getMovies = (credentials: ICredentials) => async (obj: IQueryMovies) =>
    await getUpcomingMovies(obj.page, credentials);

  return (
    <React.Fragment>
      <ListMovies getMovies={getMovies} title={"Upcoming Movies"} />
    </React.Fragment>
  );
};

export default Upcoming;
