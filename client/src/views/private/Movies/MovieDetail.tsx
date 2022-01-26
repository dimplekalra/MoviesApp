import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addMovieToFavourites,
  getMovieById,
  getMoviesCast,
  getRecommendedMovies,
  removeMovieFromFavourites,
} from "../../../common/api/movie";
import { ICast, IMovie, IMovieList } from "../../../common/interfaces";
import stateContext, { ContextProps } from "../../../context/state-context";
import Loader from "../../../controls/Loader";
import { auth } from "../../../common/utility";
import Movie from "./Movie";
import RecommendedMovies from "./Recommended";
import Casts from "./Casts";

type TParams = { movieId: string };

const MovieDetails: React.FC = (): ReactElement => {
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [recommendedMovies, setRecommendedMovies] = useState<IMovieList[]>([]);
  const [movieCast, setMovieCast] = useState<ICast[]>([]);
  const [error, setError] = useState<string>("");
  const params = useParams<TParams>();
  const history = useNavigate();
  const context = useContext(stateContext) as ContextProps;
  const { APIStatus, setAPIState, activePage } = context;
  const { movieId } = params;

  const jwt = auth.isAuthenticated();

  const loadMovie = async (movieId: string | number): Promise<void> => {
    try {
      setAPIState({
        ...context.APIStatus,
        InProgress: true,
      });

      let result = await getMovieById(movieId);

      if (result.error) {
        throw new Error(result.error);
      }

      setMovie(result.data);

      if (jwt) {
        await getRecommended(movieId);
        await getCast(movieId);
      }

      setAPIState({
        ...context.APIStatus,
        InProgress: false,
        Failed: false,
        FailMessage: "",
      });
    } catch (error: any) {
      setError(error.message);
      setAPIState({
        ...context.APIStatus,
        InProgress: false,
        Failed: true,
        FailMessage: error.message,
      });
    }
  };

  const getRecommended = async (movieId: string | number): Promise<void> => {
    try {
      let result = await getRecommendedMovies(movieId, activePage, {
        t: jwt.accessToken,
        r: jwt.refreshToken,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      const relatedList = result.data;

      setRecommendedMovies(relatedList);
    } catch (error: any) {
      setError(error.message);
    }
  };
  const getCast = async (movieId: string | number): Promise<void> => {
    try {
      let result = await getMoviesCast(movieId, {
        t: jwt.accessToken,
        r: jwt.refreshToken,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setMovieCast(result.data.cast);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const addToFavourites = async (id: string | number): Promise<void> => {
    try {
      if (!jwt) history("/signin");

      const result = await addMovieToFavourites(id, {
        t: jwt.accessToken,
        r: jwt.refreshToken,
      });
      if (movieId) await getRecommended(movieId);
      if (result.error) throw new Error(result.error);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const removeFromFavourites = async (id: string | number): Promise<void> => {
    try {
      if (!jwt) history("/signin");

      const result = await removeMovieFromFavourites(id, {
        t: jwt.accessToken,
        r: jwt.refreshToken,
      });
      if (movieId) await getRecommended(movieId);
      if (result.error) throw new Error(result.error);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    context.init();
    if (movieId) {
      loadMovie(movieId);
    }
  }, [movieId]);

  return (
    <div className="row play-movie-sec">
      <div className="col s12">
        {APIStatus.InProgress ? (
          <div className="col s12 center-align">
            <Loader />
          </div>
        ) : null}
        {movie ? (
          <div className="row">
            <div className="col s12 m9">
              <Movie movie={movie} />
            </div>

            <div className="col s12 related-movie-sec">
              <div className="col s12">
                <RecommendedMovies
                  movies={recommendedMovies}
                  addToFavourites={addToFavourites}
                  removeFromFavourites={removeFromFavourites}
                />
              </div>

              <div className="col s12">
                <Casts casts={movieCast} />
              </div>
            </div>
          </div>
        ) : null}

        {error ? <p className="flow-text center red-text">{error}</p> : null}
      </div>
    </div>
  );
};

export default MovieDetails;
