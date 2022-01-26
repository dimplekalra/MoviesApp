import { object, string, number } from "yup";

const query = {
  query: object().shape({
    sort: string(),
    genre: string(),
    year: string(),
    pageNumber: number(),
  }),
};

const params = {
  params: object({
    movieId: string().required("movie Title is required"),
  }),
};

export const getMoviesSchema = object({
  ...query,
});

export const addFavouriteMovieSchema = object({
  ...params,
});

export const getSingleMovieSchema = object({
  ...params,
});

export const removeFavouriteMovieSchema = object({
  ...params,
});
