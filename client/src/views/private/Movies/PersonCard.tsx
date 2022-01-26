import React from "react";
import { RouteProps } from "react-router-dom";
import { ICast } from "../../../common/interfaces";

interface IProps extends RouteProps {
  person: ICast;
}
const PersonCard: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { person } = props;
  function checkImageExists(image: string): string {
    if (image) {
      return `https://image.tmdb.org/t/p/w780${image}`;
    }
    return `${process.env.PUBLIC_URL}/person.jpg`;
  }

  return (
    <li className="col s3 card hoverable">
      <div className="col s12 card-image">
        <img
          src={checkImageExists(
            person.poster_path ? person.poster_path : person.profile_path
          )}
          alt={person.title || person.name}
        />
      </div>
      <div className="col s12 card-content">
        <h5 className="card-title">{person.title || person.name}</h5>

        {person.character ? (
          <p className="grey-text">{person.character} </p>
        ) : null}
      </div>
    </li>
  );
};
export default PersonCard;
