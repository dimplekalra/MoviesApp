import React from "react";
import PropTypes from "prop-types";
import { RouteProps } from "react-router-dom";
import Flickity from "react-flickity-component";
import { ICast } from "../../../common/interfaces";
import PersonCard from "./PersonCard";
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
  casts: ICast[];
}

const Casts: React.FC<IProps> = ({ casts }): React.ReactElement => {
  const jwt = auth.isAuthenticated();

  const getCast = (): React.ReactNode[] => {
    let jsx;

    if (casts && casts.length) {
      jsx = casts.map((cast: ICast, ind) => {
        return <PersonCard key={"person-" + ind} person={cast} />;
      });
    } else jsx = [<p key="cast-1">No Person Found</p>];

    return jsx;
  };

  return (
    <div className=" row">
      <div className="col s12 z-index-3">
        <h2 className="center-align">Casts</h2>
        <Flickity options={flickityOptions}>
          {jwt
            ? getCast()
            : [
                <p className="white-text" key="cast-1">
                  Please Sign In to view Movie Casts
                </p>,
              ]}
        </Flickity>
      </div>
    </div>
  );
};

Casts.propTypes = {
  casts: PropTypes.array.isRequired,
};

export default Casts;
