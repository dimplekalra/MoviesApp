import { Express, Request, Response } from "express";
import {
  addFavouriteMovieHandler,
  getAllFavouriteMovieHandler,
  getAllMoviesHandler,
  getMovieByIdHandler,
  getMovieCastsHandler,
  getMovieGenresHandler,
  getMovieHandler,
  getMovieRecommendationsHandler,
  getPopularMoviesHandler,
  getTopRatedMoviesHandler,
  getUpcomingMoviesHandler,
  removeFavouriteMovieHandler,
} from "../controller/Movie.controller";

import { validateRequest, requiresUser } from "../middleware";

import {
  addFavouriteMovieSchema,
  getSingleMovieSchema,
  getMoviesSchema,
  removeFavouriteMovieSchema,
} from "../schema/movie.schema";

export default function (app: Express) {
  // Get all Movies
  app.get("/api/movies", validateRequest(getMoviesSchema), getAllMoviesHandler);

  //Get Movie
  app.get(
    "/api/movies/search",
    [
      // requiresUser,
    ],
    getMovieHandler
  );

  //Find Movie
  app.get(
    "/api/movies/find/:movieId",
    [
      // requiresUser,
      validateRequest(getSingleMovieSchema),
    ],
    getMovieByIdHandler
  );

  //Get All Genre
  app.get(
    "/api/movies/genres",
    [
      // requiresUser,
    ],
    getMovieGenresHandler
  );

  //Get Movie Recommendations
  app.get(
    "/api/movies/recommendations/:movieId",
    [requiresUser, validateRequest(getSingleMovieSchema)],
    getMovieRecommendationsHandler
  );

  //Get Popular Movies
  app.get("/api/movies/popular", [requiresUser], getPopularMoviesHandler);

  //Get Upcoming Movies
  app.get("/api/movies/upcoming", [requiresUser], getUpcomingMoviesHandler);

  //Get top-rated Movies
  app.get("/api/movies/toprated", [requiresUser], getTopRatedMoviesHandler);

  //Get Movie Casts
  app.get(
    "/api/movies/casts/:movieId",
    [requiresUser, validateRequest(getSingleMovieSchema)],
    getMovieCastsHandler
  );

  //Get Favourite Movies
  app.get("/api/movies/favourite", [requiresUser], getAllFavouriteMovieHandler);

  // Add Movie to Favourite
  app.post(
    "/api/movies/favourite/:movieId",
    [requiresUser, validateRequest(addFavouriteMovieSchema)],
    addFavouriteMovieHandler
  );

  // Delete a Movie
  app.delete(
    "/api/movies/favourite/:movieId",
    [requiresUser, validateRequest(removeFavouriteMovieSchema)],
    removeFavouriteMovieHandler
  );
}
