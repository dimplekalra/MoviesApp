import React from "react";

import { RouteProps } from "react-router-dom";

import { IGenre, IMovie } from "../../../common/interfaces";
import Rating from "react-star-rating-component";
import { timeConvert } from "../../../common/utility";

interface IProps extends RouteProps {
  movie: IMovie;
}

function checkImageExists(image: string): string {
  if (image) {
    return `https://image.tmdb.org/t/p/w780${image}`;
  }
  return `${process.env.PUBLIC_URL}/movie.png`;
}

const Movie: React.FC<IProps> = ({ movie }): React.ReactElement => {
  return (
    <div className="row section ">
      <div className="col s12 white-text movie-detail">
        <div className="Intro col s12">
          <div className="Intro-Inner">
            <h1 className="Intro-Title Title">{movie.title}</h1>
            <div className="Intro-Info">
              <div className="Rating Intro-Rating">
                {movie.vote_average && (
                  <Rating
                    name={movie.title}
                    renderStarIcon={() => (
                      <i className="material-icons">star</i>
                    )}
                    value={Number(movie.vote_average / 2)}
                    starCount={5}
                    starColor={"red"}
                    emptyStarColor={"white"}
                  />
                )}
              </div>
              <div className="Intro-MetaInfo">
                <p className="Intro-Year Intro-Meta">
                  {new Date(movie.release_date).getFullYear()}
                </p>

                {movie.runtime ? (
                  <p>
                    <time className="Intro-Duration Intro-Meta">
                      {timeConvert(Number(movie.runtime))}
                    </time>
                  </p>
                ) : null}
              </div>
            </div>
            <p className="Intro-Desc">{movie.overview}</p>
          </div>
          {movie.backdrop_path && (
            <figure className="Intro-Figure">
              <picture className="Intro-Pic">
                <img
                  src={checkImageExists(movie.backdrop_path)}
                  alt="#"
                  className="Lazyload Lazyload_loaded Intro-Img"
                />
              </picture>
            </figure>
          )}
        </div>
        <div className="Details row">
          <div className="Details-Column Details-Column_left col s12 m5 l4">
            {movie.backdrop_path && (
              <figure className="Details-Figure">
                <picture className="Details-Picture">
                  <img
                    src={checkImageExists(movie.backdrop_path)}
                    alt="#"
                    width="342"
                    height="513"
                    className="Lazyload Lazyload_loaded Details-Poster"
                  />
                </picture>
              </figure>
            )}
          </div>
          <div className="Details-Column Details-Column_right col s12 m6 l6 ">
            <h2 className="Details-Title">Storyline</h2>
            <p className="Details-Overview">{movie.overview}</p>
            <table className="Details-Table">
              <tbody>
                <tr className="Details-TableRow">
                  <td className="Details-TableData">Released</td>
                  <td className="Details-TableData">
                    {new Date(movie.release_date).toDateString()}
                  </td>
                </tr>
                <tr className="Details-TableRow">
                  <td className="Details-TableData">Runtime</td>
                  <td className="Details-TableData">
                    {timeConvert(Number(movie.runtime))}
                  </td>
                </tr>
                <tr className="Details-TableRow">
                  <td className="Details-TableData">Budget</td>
                  <td className="Details-TableData">${movie.budget}</td>
                </tr>
                <tr className="Details-TableRow">
                  <td className="Details-TableData">Genres</td>
                  <td className="Details-TableData">
                    {movie.genres && Array.isArray(movie.genres)
                      ? movie.genres.map((val: IGenre) => val.name).join(", ")
                      : ""}
                  </td>
                </tr>
                <tr className="Details-TableRow">
                  <td className="Details-TableData">Status</td>
                  <td className="Details-TableData">{movie.status}</td>
                </tr>
                <tr className="Details-TableRow">
                  <td className="Details-TableData">Language</td>
                  <td className="Details-TableData">
                    {movie.spoken_languages
                      ? movie.spoken_languages.map((val) => val.name).join(", ")
                      : ""}
                  </td>
                </tr>
                <tr className="Details-TableRow">
                  <td className="Details-TableData">Production</td>
                  <td className="Details-TableData">
                    {movie.production_companies
                      ? movie.production_companies
                          .map((val) => val.name)
                          .join(", ")
                      : ""}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;
