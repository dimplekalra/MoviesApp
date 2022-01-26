import React, { useContext, useEffect } from "react";
import MovieList from "./Movielist";
import { auth } from "../../../common/utility";
import { RouteProps, useNavigate } from "react-router-dom";
import stateContext, { ContextProps } from "../../../context/state-context";
import Loader from "../../../controls/Loader";
import Pagination from "react-js-pagination";
import { searchMovie } from "../../../common/api/movie";
import { ICredentials, IQueryMovies } from "../../../common/interfaces";

interface IProps extends RouteProps {
  getMovies: (obj: ICredentials) => (query: IQueryMovies) => void;
  title: string;
}

const ListMovies: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const history = useNavigate();
  const context = useContext(stateContext) as ContextProps;

  const {
    APIStatus,
    FilteredArray,
    fetching,
    genres,
    year,
    sortBy,
    activePage,
    HandlePageChange,
    totalResults,
    search,
  } = context;

  useEffect(() => {
    context.init();
  }, []);

  useEffect(() => {
    loadMovies();
  }, [genres.length, year, sortBy, activePage, search]);

  const searchMoviesList = async (): Promise<void> => {
    try {
      await context.loadData(async () => await searchMovie(search, activePage));

      if (!context.FilteredArray || !context.FilteredArray.length)
        throw new Error("could not load videos please try again later");
    } catch (error: any) {
      console.log(error);
    }
  };

  const getMovies = async (): Promise<void> => {
    try {
      const obj: IQueryMovies = {
        genres,
        year,
        sort: sortBy,
        page: activePage,
      };

      const jwt = auth.isAuthenticated();

      if (!jwt) history("/signin");

      context.setAPIState({
        ...context.APIStatus,
        InProgress: true,
        Failed: false,
        FailMessage: "",
      });

      await context.loadData(
        async () =>
          await props.getMovies({ t: jwt.accessToken, r: jwt.refreshToken })(
            obj
          )
      );

      if (!context.FilteredArray || !context.FilteredArray.length) {
        throw new Error("failed to load");
      }
    } catch (error: any) {
      context.setAPIState({
        ...context.APIStatus,
        Failed: true,
        FailMessage: error.message,
      });
    } finally {
      context.setAPIState({
        ...context.APIStatus,

        InProgress: false,
      });
    }
  };

  const loadMovies = (): void => {
    if (search.trim()) {
      searchMoviesList();
      return;
    }
    getMovies();
  };

  return (
    <div className="row">
      <div className="card col s12 ">
        <div className="card-content">
          <div className="card-title">
            <h3 className="center-align">{props.title}</h3>
          </div>
          {fetching ? (
            <div className="col s12 center-align">
              <Loader />
            </div>
          ) : null}
          {FilteredArray.length === 0 && !fetching ? (
            <li className="list-item">
              <p className="flow-text"> No Movies Found </p>
            </li>
          ) : (
            <MovieList movies={FilteredArray} reloadMovies={getMovies} />
          )}
          {APIStatus.Failed ? (
            <p className="red-text center flow-text">{APIStatus.FailMessage}</p>
          ) : null}
        </div>
      </div>
      <div className="col s12 right-align">
        <Pagination
          hideFirstLastPages
          prevPageText="Prev"
          nextPageText="Next"
          activePage={activePage}
          itemsCountPerPage={9}
          totalItemsCount={totalResults}
          pageRangeDisplayed={5}
          onChange={HandlePageChange}
          innerClass="custom_pagination"
        />
      </div>
    </div>
  );
};

export default ListMovies;
