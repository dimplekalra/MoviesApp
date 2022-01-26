export interface IAcceptAll {
  [x: string]: any;
}
// //
export interface IApiCallStatus {
  InProgress: boolean;
  Failed: boolean;
  FailMessage: string;
}

export interface ILogin {
  accessToken: string;
  refreshToken: string;
  expiry: string;
}

export interface ICredentials {
  t: string;
  r: string;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface IQueryMovies {
  genres: number[];
  sort: string;
  year: string;
  page: number;
}

export interface IUser {
  createdAt: string;
  email: string;
  name: string;
  updatedAt: string;
  _id: string;
}

export interface IJWT {
  accessToken: string;
  refreshToken: string;
  timestamp: Date;
  expiry: string;
}

export interface IMovie {
  _id: string;
  adult: boolean;
  backdrop_path?: string;
  belongs_to_collection?: object | string;
  budget?: number;
  genres?: IGenre[];
  homepage?: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity?: number;
  poster_path?: string;
  production_companies?: any[];
  // {
  //   id: number;
  //   logo_path: string;
  //   name: string;
  //   origin_country: string;
  // }[];

  production_countries: any[];
  release_date: Date | string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline?: string;
  title: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
  isLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMovieList {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number | string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  isLiked: boolean;
}

export interface ICast {
  adult: boolean;
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  name: string;
  order: number;
  overview: string;
  profile_path: string;
  poster_path: string;
  title: string;
}

export type API = "user" | "movie";
