import React from "react";
import { RouteProps, useNavigate } from "react-router-dom";
import { IMovieList } from "../../../common/interfaces";
import Rating from "react-star-rating-component";

interface IProps extends RouteProps {
  movie: IMovieList;
  addToFavourites: (movieId: string | number) => Promise<void>;
  removeFromFavourites: (movieId: string | number) => Promise<void>;
}
const MovieCard: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { movie, addToFavourites, removeFromFavourites } = props;
  function checkImageExists(image: string): string {
    if (image) {
      return `https://image.tmdb.org/t/p/w780${image}`;
    }
    return `${process.env.PUBLIC_URL}/movie.png`;
  }
  const history = useNavigate();

  return (
    <li
      className="col s3 card hoverable"
      onClick={() => history(`/movies/movie/${movie.id}`)}
    >
      <div className="col s12 card-image">
        <img
          src={checkImageExists(movie.poster_path)}
          alt={movie.title}
          width="240"
          height="360"
        />
        <span
          className="btn-floating halfway-fab waves-effect waves-light red"
          onClick={(e) => {
            e.stopPropagation();
            movie.isLiked
              ? removeFromFavourites(movie.id)
              : addToFavourites(movie.id);
          }}
        >
          <i className="material-icons" style={{ color: "yellow" }}>
            {movie.isLiked ? "favorite" : "favorite_border"}
          </i>
        </span>
      </div>
      <div className="col s12 card-content">
        <h5 className="card-title">{movie.title}</h5>
        <p>
          {movie.release_date ? (
            <b>{new Date(movie.release_date).getFullYear()}</b>
          ) : null}
        </p>
        <div className="col s12">
          <Rating
            name={movie.title}
            renderStarIcon={() => <i className="material-icons">star</i>}
            value={Number(movie.vote_average / 2)}
            starCount={5}
            starColor={"red"}
            emptyStarColor={"white"}
          />
        </div>
      </div>
    </li>
  );
};
export default MovieCard;
