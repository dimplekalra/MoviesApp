import React, { ReactNode } from "react";
import PropTypes from "prop-types";
import { RouteProps } from "react-router-dom";
import Flickity from "react-flickity-component";
import { IMovieList } from "../../../common/interfaces";
import MovieCard from "./MovieCard";
import { auth } from "../../../common/utility";

const flickityOptions = {
  freeScroll: true,
  contain: true,
  cellAlign: "left",
  prevNextButtons: true,
  pageDots: false,
  freeScrollFriction: 0.2,
  selectedAttraction: 0.01,
  friction: 0.15,
  groupCells: "100%",
  resize: true,
};

interface IProps extends RouteProps {
  movies: IMovieList[];
  addToFavourites: (movieId: string | number) => Promise<void>;
  removeFromFavourites: (movieId: string | number) => Promise<void>;
}

const Recommended: React.FC<IProps> = ({
  movies,
  addToFavourites,
  removeFromFavourites,
}): React.ReactElement => {
  const jwt = auth.isAuthenticated();

  const recommendedMovies = (): ReactNode[] => {
    let jsx;

    if (movies && movies.length) {
      jsx = movies.map((movie: IMovieList, ind: number) => {
        return (
          <MovieCard
            key={"movie-" + ind}
            movie={movie}
            addToFavourites={addToFavourites}
            removeFromFavourites={removeFromFavourites}
          />
        );
      });
    } else jsx = [<p key="movie-1">No Movie Found</p>];

    return jsx;
  };

  return (
    <div className=" row">
      <div className="col s12 z-index-3">
        <h2 className="center-align">Recommended Movies</h2>
        <Flickity elementType={"div"} options={flickityOptions}>
          {jwt
            ? recommendedMovies()
            : [
                <p className="white-text" key="movie-1">
                  Please Sign In to view Recommendations
                </p>,
              ]}
        </Flickity>
      </div>
    </div>
  );
};

Recommended.propTypes = {
  movies: PropTypes.array.isRequired,
};

export default Recommended;
