import { DocumentDefinition, FilterQuery, QueryOptions } from "mongoose";
import Movie, { IMovieDocument } from "../model/movie.model";
import axios from "axios";
import { API_KEY, MOVIE_API_URL } from "../utils/secrets";

// import config from "config";

console.log(
  "service undefined",
  <string>process.env["MOVIE_API_URL"] || MOVIE_API_URL
);

const API_URL = (process.env.Movie_API_URL as string) || MOVIE_API_URL;
// || config.get("Movie_API_URL") as string;
// || config.get("API_KEY") as string;

export function addToFavourite(input: DocumentDefinition<IMovieDocument>) {
  return Movie.create(input);
}

export async function findAllMovies(queryObject: {
  sort?: string | undefined;
  genre?: string | undefined;
  year?: string | undefined;
  page?: number | undefined;
}) {
  const { sort, genre, year, page } = queryObject;

  const discoverApi = `${API_URL}discover/movie?api_key=${API_KEY}${
    sort ? "&sort_by=" + sort : ""
  }${genre ? "&with_genres=" + genre : ""}${
    year ? "&primary_release_year=" + year : ""
  }${page ? "&page=" + page : ""}`;

  return await axios.get(discoverApi);
}

export async function searchMovie(
  query: string | null,
  page?: number | undefined
) {
  const searchApi = `${API_URL}search/movie?&api_key=${API_KEY}&query=${query}${
    page ? "&page=" + page : ""
  }`;

  return await axios.get(searchApi);
}

export async function findMovie(movieId: string | number) {
  const findApi = `${API_URL}movie/${movieId}?&api_key=${API_KEY}&language=en-US`;

  return await axios.get(findApi);
}

export async function findAllFavouriteMovies(queryObject: {
  sort?: string | undefined;
  genre?: string | undefined;
  year?: string | undefined;
  page?: number | undefined;
}) {
  let { sort, genre, year, page } = queryObject;
  const perpage = 20;
  let matchColumn: any = {};
  page = Number(page);

  let sortBy: any = { popularity: -1 };

  if (sort) {
    let temp = sort.split(".");
    switch (temp[0]) {
      case "popularity": {
        sortBy = { [temp[0]]: temp[1] === "asc" ? 1 : -1 };
        break;
      }
      case "release_date": {
        sortBy = { [temp[0]]: temp[1] === "asc" ? 1 : -1 };
        break;
      }
      case "revenue": {
        sortBy = { [temp[0]]: temp[1] === "asc" ? 1 : -1 };
        break;
      }
      default:
        sortBy = { popularity: -1 };
    }
  }

  let skip = page > 0 ? (page - 1) * perpage : 0;

  if (genre) {
    const genres = genre.split("|").map((val) => Number(val));

    matchColumn["genres.id"] = {
      $in: genres,
    };
  }

  if (year) {
    matchColumn["year"] = Number(year);
  }
  return await Movie.aggregate([
    { $addFields: { year: { $year: "$release_date" } } },
    {
      $match: matchColumn,
    },
    {
      $sort: sortBy,
    },
    {
      $skip: skip,
    },
    {
      $limit: perpage,
    },
  ]);
}

export function findFavouriteMovie(
  query: FilterQuery<IMovieDocument>,
  options: QueryOptions = { lean: true }
) {
  return Movie.findOne(query, {}, options);
}

export async function findMovieGenres() {
  const genreApi = `${API_URL}genre/movie/list?api_key=${API_KEY}&language=en-US`;
  return await axios.get(genreApi);
}

export async function findMovieRecommendations(
  movieId: string | number,
  page: number | undefined
) {
  const recommendationAPI = `${API_URL}movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=${
    page ? page : 1
  }`;
  return await axios.get(recommendationAPI);
}

export async function findPopularMovies(page: number | undefined) {
  const popularAPI = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${
    page ? page : 1
  }`;
  return await axios.get(popularAPI);
}

export async function findUpcomingMovies(page: number | undefined) {
  const upcomingAPI = `${API_URL}movie/upcoming?api_key=${API_KEY}&language=en-US&page=${
    page ? page : 1
  }`;
  return await axios.get(upcomingAPI);
}

export async function findTopRatedMovies(page: number | undefined) {
  const topRatedAPI = `${API_URL}movie/top_rated?api_key=${API_KEY}&language=en-US&page=${
    page ? page : 1
  }`;
  return await axios.get(topRatedAPI);
}

export async function findMovieCasts(movieId: string | number) {
  const castApi = `${API_URL}movie/${movieId}/casts?api_key=${API_KEY}`;
  return await axios.get(castApi);
}

export function removeFromFavourite(query: FilterQuery<IMovieDocument>) {
  return Movie.deleteOne(query);
}
