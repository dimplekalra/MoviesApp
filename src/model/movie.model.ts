import mongoose from "mongoose";

export interface IMovieDocument extends mongoose.Document {
  adult: boolean;
  backdrop_path?: string;
  belongs_to_collection?: object | string;
  budget?: number;
  genres?: { id: number; name: string }[];
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

const MovieSchema = new mongoose.Schema(
  {
    adult: {
      type: Boolean,
      required: true,
      default: true,
    },
    backdrop_path: {
      type: String,
    },
    belongs_to_collection: {
      type: mongoose.Schema.Types.Mixed,
    },
    budget: {
      type: Number,
    },
    genres: {
      type: mongoose.Schema.Types.Array,
    },
    homepage: String,
    id: Number,
    imdb_id: String,
    original_language: {
      type: String,
      default: "en",
    },
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    production_companies: mongoose.Schema.Types.Array,
    production_countries: mongoose.Schema.Types.Array,
    release_date: Date,
    revenue: Number,
    runtime: Number,
    spoken_languages: mongoose.Schema.Types.Array,
    status: String,
    tagline: String,
    title: { type: String, required: true },
    video: Boolean,
    vote_average: Number,
    vote_count: Number,
  },
  { timestamps: true }
);

const Movie = mongoose.model<IMovieDocument>("Movie", MovieSchema);

export default Movie;
