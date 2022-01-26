import React from "react";
import { RouteProps } from "react-router-dom";
import { IGenre } from "../common/interfaces";
import Input from "./Input";

interface IProps extends RouteProps {
  allGenres: IGenre[];
  genres: number[];
  year: string;
  sortBy: string;
  handleChange: (name: string, value: string) => void;
}

const SearchInputs: React.FC<IProps> = ({
  allGenres,
  handleChange,
  genres,
  year,
  sortBy,
}) => {
  return (
    <React.Fragment>
      {allGenres && allGenres.length ? (
        <div className="col s1" style={{ display: "contents" }}>
          {allGenres.map((val: IGenre, index: number) => (
            <div
              className="chip"
              key={"genre" + index}
              onClick={() => {
                handleChange("genre", val.id.toString());
              }}
            >
              <span
                style={{
                  color: genres.includes(val.id) ? "#26a69a" : "red",
                }}
              >
                {genres.includes(val.id) ? (
                  <i className="material-icons prefix">check</i>
                ) : null}
                {val.name}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="row">
        <div className="col s12">
          <div className="input-field col s3">
            <Input
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let val = e.target.value;
                val = val.trim();

                if (
                  (typeof val === "string" &&
                    val.length > 0 &&
                    !isNaN(Number(val)) &&
                    !isNaN(parseFloat(val))) ||
                  !val.length
                )
                  handleChange(e.target.name, e.target.value);
              }}
              name="year"
              id="Year"
              icon="date_range"
              value={year}
            />
          </div>
          <div className="input-field col s3 right">
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleChange("sort", e.target.value)
              }
            >
              <option value="" disabled>
                Sort By
              </option>
              <option value="popularity.desc">Popularity ▼</option>
              <option value="popularity.asc">Popularity ▲</option>
              <option value="release_date.desc">Release Date ▼</option>
              <option value="release_date.asc">Release Date ▲</option>
              <option value="revenue.desc">Earnings ▼</option>
              <option value="revenue.asc">Earnings ▲</option>
            </select>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SearchInputs;
