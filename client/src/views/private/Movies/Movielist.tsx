import React, { useContext, useState } from "react";
import { useNavigate, RouteProps } from "react-router-dom";
import { IMovieList } from "../../../common/interfaces";

import stateContext, { ContextProps } from "../../../context/state-context";
import { auth } from "../../../common/utility";
import {
  addMovieToFavourites,
  removeMovieFromFavourites,
} from "../../../common/api/movie";
import MovieCard from "./MovieCard";

interface IProps extends RouteProps {
  movies: IMovieList[];
  reloadMovies: () => void;
}

const MovieList: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { movies, reloadMovies } = props;
  const [error, setError] = useState<string>("");
  const context = useContext(stateContext) as ContextProps;

  const history = useNavigate();

  const addToFavourites = async (movieId: string | number): Promise<void> => {
    try {
      const jwt = auth.isAuthenticated();

      if (!jwt) history("/signin");

      const result = await addMovieToFavourites(movieId, {
        t: jwt.accessToken,
        r: jwt.refreshToken,
      });
      await context.loadData(() => reloadMovies());
      if (result.error) throw new Error(result.error);
    } catch (error: any) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const removeFromFavourites = async (
    movieId: string | number
  ): Promise<void> => {
    try {
      const jwt = auth.isAuthenticated();

      if (!jwt) history("/signin");

      const result = await removeMovieFromFavourites(movieId, {
        t: jwt.accessToken,
        r: jwt.refreshToken,
      });
      await context.loadData(() => reloadMovies());
      if (result.error) throw new Error(result.error);
    } catch (error: any) {
      setError(error.message);
      console.log(error.message);
    }
  };
  const renderList = (): React.ReactNode => {
    return (
      <div className="video-list">
        <ul className="row">
          {movies.map((movie: IMovieList, idx: number) => {
            return (
              <MovieCard
                key={"movie-" + idx}
                movie={movie}
                addToFavourites={addToFavourites}
                removeFromFavourites={removeFromFavourites}
              />
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <React.Fragment>
      {renderList()}
      {error ? <p className="flow-text red-text center">{error}</p> : null}
    </React.Fragment>
  );
};

export default MovieList;
