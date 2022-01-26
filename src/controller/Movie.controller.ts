import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import Movie, { IMovieDocument } from "../model/movie.model";
import {
  addToFavourite,
  findAllFavouriteMovies,
  findAllMovies,
  findFavouriteMovie,
  findMovie,
  findMovieCasts,
  findMovieGenres,
  findMovieRecommendations,
  findPopularMovies,
  findTopRatedMovies,
  findUpcomingMovies,
  removeFromFavourite,
  searchMovie,
} from "../service/movie.service";

export async function getAllMoviesHandler(req: Request, res: Response) {
  try {
    let queryObj = {};

    const sort: string | undefined = req.query.sort
      ? String(req.query.sort)
      : undefined;
    const genre: string | undefined = req.query.genre
      ? String(req.query.genre)
      : undefined;

    const year: string | undefined = req.query.year
      ? String(req.query.year)
      : undefined;
    const page: number | undefined = req.query.page
      ? Number(req.query.page)
      : undefined;

    queryObj = { sort, genre, year, page };

    const result = await findAllMovies(queryObj);

    if (!result.data.results || !result.data.results.length) {
      return res.status(404).json({ data: null, error: "Not Found" });
    }

    let movies = result.data.results;
    const totalPages = result.data.total_pages;
    const totalResults = result.data.total_results;

    movies = await Promise.allSettled(
      movies.map(async (movie: IMovieDocument) => {
        let exist = await Movie.findOne({ id: movie.id });
        return {
          ...movie,
          isLiked: exist ? true : false,
        };
      })
    );

    movies = movies.map(
      (movie: { status: string; value: any }) => movie["value"]
    );

    return res.json({
      message: "Success",
      data: movies,
      page,
      totalPages,
      totalResults,
    });
  } catch (e: any) {
    log.error(e);
    return res.status(400).json({ data: null, error: e.message });
  }
}

export async function getMovieHandler(req: Request, res: Response) {
  try {
    const searchText: string | undefined = String(req.query.searchText);
    const pageNumber: string | number | undefined = Number(req.query.page);
    const result = await searchMovie(searchText, pageNumber);

    if (!result.data) {
      return res.status(404).json({ data: null, error: "Movie Not Found" });
    }

    let movies = result.data.results;

    movies = await Promise.allSettled(
      movies.map(async (movie: any) => {
        let exist = await Movie.findOne({ id: movie.id });
        return {
          ...movie,
          isLiked: exist ? true : false,
        };
      })
    );

    movies = movies.map((movie: any) => movie["value"]);

    return res.json({
      message: "Success",
      data: result.data.results,
      page: result.data.page,
      totalPages: result.data.total_pages,
      totalResults: result.data.total_results,
    });
  } catch (error: any) {
    // console.log(error);
    log.error(error);
    return res.status(400).json({ data: null, error: error.message });
  }
}

export async function getMovieByIdHandler(req: Request, res: Response) {
  try {
    const movieId: string | number = get(req, "params.movieId");

    if (!movieId) {
      return res
        .status(400)
        .json({ data: null, error: "Movie Id is required" });
    }
    const result = await findMovie(movieId);

    let movie = result.data;

    if (!movie) {
      return res.status(404).json({ data: null, error: "Movie Not Found" });
    }

    let exist = await findFavouriteMovie({ id: movieId });

    movie = {
      ...movie,
      isLiked: exist ? true : false,
    };

    return res.json({ message: "Success", data: movie });
  } catch (error: any) {
    // console.log(error);
    log.error(error);
    return res.status(400).json({ data: null, error: error.message });
  }
}

export async function getAllFavouriteMovieHandler(req: Request, res: Response) {
  try {
    let queryObj = {};

    const sort: string | undefined = req.query.sort
      ? String(req.query.sort)
      : undefined;
    const genre: string | undefined = req.query.genre
      ? String(req.query.genre)
      : undefined;

    const year: string | undefined = req.query.year
      ? String(req.query.year)
      : undefined;
    const page: number | undefined = req.query.page
      ? Number(req.query.page)
      : undefined;

    queryObj = { sort, genre, year, page };

    let movies = await findAllFavouriteMovies(queryObj);

    if (!movies) {
      return res.status(404).json({ data: null, error: "Not Found" });
    }

    movies = movies.map((val: IMovieDocument) => ({ ...val, isLiked: true }));

    const totalResults = await Movie.countDocuments();
    const totalPages = Math.ceil(totalResults / 20);

    return res.json({
      message: "Success",
      data: movies,
      totalPages: totalPages,
      totalResults: movies.length,
    });
  } catch (error: any) {
    // console.log(error);
    log.error(error);
    return res.status(400).json({ data: null, error: error.message });
  }
}

export async function getFavouriteMovieHandler(req: Request, res: Response) {
  try {
    const movieId = get(req, "params.movieId");
    const movie = await findFavouriteMovie({ id: movieId });

    if (!movie) {
      return res.status(404).json({ data: null, error: "Not Found" });
    }

    return res.json({ message: "Success", data: { ...movie, isLiked: true } });
  } catch (error: any) {
    // console.log(error);
    log.error(error);
    return res.status(400).json({ data: null, error: error.message });
  }
}

export async function getMovieGenresHandler(req: Request, res: Response) {
  try {
    const result = await findMovieGenres();
    const genres = result.data;
    if (!genres) {
      return res.status(404).json({ data: null, error: "Not Found" });
    }

    return res.json({ message: "Success", data: genres });
  } catch (error: any) {
    // console.log(error);
    log.error(error);
    return res.status(400).json({ data: null, error: error.message });
  }
}

export async function getMovieRecommendationsHandler(
  req: Request,
  res: Response
) {
  try {
    const movieId: string | number = req.params.movieId;
    let page: number | undefined = req.query.page
      ? Number(req.query.page)
      : undefined;

    if (!movieId) {
      return res.status(400).json({ data: null, error: "Bad Request" });
    }
    const result = await findMovieRecommendations(movieId, page);

    let movies = result.data.results;
    if (!movies) {
      return res.status(404).json({ data: null, error: "Not Found" });
    }

    const totalPages = result.data.total_pages;
    const totalResults = result.data.total_results;
    page = result.data.page;
    movies = await Promise.allSettled(
      movies.map(async (movie: IMovieDocument) => {
        let exist = await Movie.findOne({ id: movie.id });
        return {
          ...movie,
          isLiked: exist ? true : false,
        };
      })
    );

    movies = movies.map(
      (movie: { status: string; value: any }) => movie["value"]
    );

    return res.json({
      message: "Success",
      data: movies,
      totalPages,
      totalResults,
      page,
    });
  } catch (error: any) {
    // console.log(error);
    log.error(error);
    return res.status(400).json({ data: null, error: error.message });
  }
}

export async function getPopularMoviesHandler(req: Request, res: Response) {
  try {
    let page: number | undefined = req.query.page
      ? Number(req.query.page)
      : undefined;
    const result = await findPopularMovies(page);
    let movies = result.data.results;

    if (!movies) {
      return res.status(404).json({ data: null, error: "Not Found" });
    }

    const totalPages = result.data.total_pages;
    const totalResults = result.data.total_results;
    page = result.data.page;
    movies = await Promise.allSettled(
      movies.map(async (movie: IMovieDocument) => {
        let exist = await Movie.findOne({ id: movie.id });
        return {
          ...movie,
          isLiked: exist ? true : false,
        };
      })
    );

    movies = movies.map(
      (movie: { status: string; value: any }) => movie["value"]
    );

    return res.json({
      message: "Success",
      data: movies,
      page: page,
      totalPages: totalPages,
      totalResults: totalResults,
    });
  } catch (error: any) {
    // console.log(error);
    log.error(error);
    return res.status(400).json({ data: null, error: error.message });
  }
}

export async function getUpcomingMoviesHandler(req: Request, res: Response) {
  try {
    let page: number | undefined = req.query.page
      ? Number(req.query.page)
      : undefined;
    const result = await findUpcomingMovies(page);

    let movies = result.data.results;
    if (!movies) {
      return res.status(404).json({ data: null, error: "Not Found" });
    }

    const totalPages = result.data.total_pages;
    const totalResults = result.data.total_results;
    page = result.data.page;
    movies = await Promise.allSettled(
      movies.map(async (movie: IMovieDocument) => {
        let exist = await Movie.findOne({ id: movie.id });
        return {
          ...movie,
          isLiked: exist ? true : false,
        };
      })
    );

    movies = movies.map(
      (movie: { status: string; value: any }) => movie["value"]
    );

    return res.json({
      message: "Success",
      data: movies,
      page: page,
      totalPages: totalPages,
      totalResults: totalResults,
    });
  } catch (error: any) {
    // console.log(error);
    log.error(error);
    return res.status(400).json({ data: null, error: error.message });
  }
}

export async function getTopRatedMoviesHandler(req: Request, res: Response) {
  try {
    let page: number | undefined = req.query.page
      ? Number(req.query.page)
      : undefined;
    const result = await findTopRatedMovies(page);
    let movies = result.data.results;
    if (!movies) {
      return res.status(404).json({ data: null, error: "Not Found" });
    }

    const totalPages = result.data.total_pages;
    const totalResults = result.data.total_results;
    page = result.data.page;
    movies = await Promise.allSettled(
      movies.map(async (movie: IMovieDocument) => {
        let exist = await Movie.findOne({ id: movie.id });
        return {
          ...movie,
          isLiked: exist ? true : false,
        };
      })
    );

    movies = movies.map(
      (movie: { status: string; value: any }) => movie["value"]
    );

    return res.json({
      message: "Success",
      data: movies,
      page: page,
      totalPages: totalPages,
      totalResults: totalResults,
    });
  } catch (error: any) {
    // console.log(error);
    log.error(error);
    return res.status(400).json({ data: null, error: error.message });
  }
}

export async function getMovieCastsHandler(req: Request, res: Response) {
  try {
    const movieId: string | number = req.params.movieId;
    if (!movieId) {
      return res
        .status(400)
        .json({ data: null, error: "Please Provide Movie Id" });
    }
    const result = await findMovieCasts(movieId);

    const casts = result.data;

    if (!casts) {
      return res.status(404).json({ data: null, error: "Not Found" });
    }

    return res.json({ message: "Success", data: casts });
  } catch (error: any) {
    // console.log(error);
    log.error(error);
    return res.status(400).json({ data: null, error: error.message });
  }
}

export async function addFavouriteMovieHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "user._id");
    const movieId = get(req, "params.movieId");

    if (!movieId) {
      return res
        .status(400)
        .json({ data: null, error: "Movie Id is required" });
    }

    let result: any;
    result = await findFavouriteMovie({ id: movieId });

    if (result)
      return res.status(409).json({
        data: null,
        message: "Movie Already Added into favourites",
      });

    result = await findMovie(movieId);

    let movie = result.data;

    if (!movie) {
      return res.status(404).json({ data: null, error: "Movie Not Found" });
    }

    movie = await addToFavourite(movie);

    movie = {
      ...movie,
      isLiked: true,
    };

    return res.status(200).json({ message: "Success", data: movie });
  } catch (e: any) {
    // console.log(e);
    log.error(e);
    return res.status(409).json({ data: null, error: e.message });
  }
}

export async function removeFavouriteMovieHandler(req: Request, res: Response) {
  try {
    const userId = get(req, "user._id");
    const movieId = get(req, "params.movieId");

    const movie = await findFavouriteMovie({ id: movieId });

    if (!movie) {
      return res.status(404).json({ data: null, error: "Not Found" });
    }

    await removeFromFavourite({ id: movieId });

    return res
      .status(200)
      .json({ data: null, message: "Removed Successfully" });
  } catch (e: any) {
    // console.log(e);
    log.error(e);
    return res.status(409).json({ data: null, error: e.message });
  }
}
