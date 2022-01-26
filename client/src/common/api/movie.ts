import { BaseURL } from "../endpoints";

import { ICredentials, IQueryMovies } from "../interfaces";

export interface IParams {
  userId?: string | number;
  mediaId?: string | number;
}

export const getAllMovies = (obj: IQueryMovies) => {
  let { genres, sort, year, page } = obj;

  let queryString = "?";

  if ((genres && genres.length) || sort || year || page) {
    queryString += Object.entries(obj)
      .reduce((acc: string[], val) => {
        switch (val[0]) {
          case "genres":
            return val[1] && val[1].length
              ? acc.concat(`genre=${val[1].join("|")}`)
              : acc;
          case "sort":
            return val[1] ? acc.concat(`sort=${val[1]}`) : acc;
          case "year":
            return val[1] && Number(val[1]) > 1900
              ? acc.concat(`year=${val[1]}`)
              : acc;
          case "page":
            return val[1] ? acc.concat(`page=${val[1]}`) : acc;
          default:
            return acc;
        }
      }, [])
      .join("&");
  }

  return fetch(`${BaseURL}/movies${queryString}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};

export const getPopularMovies = (page: number, credentials: ICredentials) => {
  return fetch(`${BaseURL}/movies/popular?page=${page}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + credentials.t,
      "x-refresh": credentials.r,
    },
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};

export const getUpcomingMovies = (page: number, credentials: ICredentials) => {
  return fetch(`${BaseURL}/movies/upcoming?page=${page}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + credentials.t,
      "x-refresh": credentials.r,
    },
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};

export const getTopRatedMovies = (page: number, credentials: ICredentials) => {
  return fetch(`${BaseURL}/movies/toprated?page=${page}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + credentials.t,
      "x-refresh": credentials.r,
    },
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};

export const getRecommendedMovies = (
  movieId: string | number,
  page: number,
  credentials: ICredentials
) => {
  return fetch(`${BaseURL}/movies/recommendations/${movieId}?page=${page}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + credentials.t,
      "x-refresh": credentials.r,
    },
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};

export const getFavouriteMovies = (
  credentials: ICredentials,
  obj: IQueryMovies
) => {
  let { genres, sort, year, page } = obj;

  let queryString = "?";

  if ((genres && genres.length) || sort || year || page) {
    queryString += Object.entries(obj)
      .reduce((acc: string[], val) => {
        switch (val[0]) {
          case "genres":
            return val[1] && val[1].length
              ? acc.concat(`genre=${val[1].join("|")}`)
              : acc;
          case "sort":
            return val[1] ? acc.concat(`sort=${val[1]}`) : acc;
          case "year":
            return val[1] && Number(val[1]) > 1900
              ? acc.concat(`year=${val[1]}`)
              : acc;
          case "page":
            return val[1] ? acc.concat(`page=${val[1]}`) : acc;
          default:
            return acc;
        }
      }, [])
      .join("&");
  }

  return fetch(`${BaseURL}/movies/favourite${queryString}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + credentials.t,
      "x-refresh": credentials.r,
    },
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};

export const getMoviesCast = (
  movieId: string | number,
  credentials: ICredentials
) => {
  return fetch(`${BaseURL}/movies/casts/${movieId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + credentials.t,
      "x-refresh": credentials.r,
    },
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};

export const getMovieGenres = () => {
  return fetch(`${BaseURL}/movies/genres`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};

export const searchMovie = (
  searchText: string,
  pageNumber?: string | number
) => {
  const queryString = `?${searchText ? "searchText=" + searchText : ""}${
    "&page=" + pageNumber
  }`;

  return fetch(`${BaseURL}/movies/search${queryString}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err: Error) => console.log(err));
};

export const getMovieById = (movieId: string | number) => {
  return fetch(`${BaseURL}/movies/find/${movieId}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err: Error) => console.log(err));
};

export const addMovieToFavourites = (
  movieId: string | number,
  credentials: ICredentials
) => {
  return fetch(`${BaseURL}/movies/favourite/${movieId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + credentials.t,
      "x-refresh": credentials.r,
    },
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};

export const removeMovieFromFavourites = (
  movieId: string | number,
  credentials: ICredentials
) => {
  return fetch(`${BaseURL}/movies/favourite/${movieId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Bearer " + credentials.t,
      "x-refresh": credentials.r,
    },
  })
    .then((res) => res.json())
    .catch((err: Error) => console.log(err));
};
