import React, { useContext, useEffect } from "react";
import MovieList from "../views/private/Movies/Movielist";
import { getAllMovies, searchMovie } from "../common/api/movie";
import stateContext, { ContextProps } from "../context/state-context";
import Loader from "../controls/Loader";
import { IQueryMovies } from "../common/interfaces";
import Pagination from "react-js-pagination";
import { RouteProps } from "react-router-dom";

interface IProps extends RouteProps {}

const Home: React.FC<IProps> = (): React.ReactElement => {
  const context = useContext(stateContext) as ContextProps;

  const {
    APIStatus,
    FilteredArray,
    genres,
    year,
    sortBy,
    activePage,
    totalResults,
    search,
    fetching,
    HandlePageChange,
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

      if (!context.FilteredArray)
        throw new Error("could not load videos please try again later");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getMoviesList = async (): Promise<void> => {
    try {
      const obj: IQueryMovies = {
        genres,
        year,
        sort: sortBy,
        page: activePage,
      };

      await context.loadData(async () => await getAllMovies(obj));

      if (!context.FilteredArray || !context.FilteredArray.length)
        throw new Error("could not load videos please try again later");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const loadMovies = (): void => {
    if (search.trim()) {
      searchMoviesList();
      return;
    }
    getMoviesList();
  };

  return (
    <div className="row main-sec">
      <div className=" col s12 ">
        <h3 className="center-align">Movies</h3>

        {fetching ? (
          <div className="col s12 center-align">
            <Loader />
          </div>
        ) : null}
        {!fetching && !FilteredArray.length ? (
          <h4 className="flow-text center">No Movies Found</h4>
        ) : (
          <MovieList movies={FilteredArray} reloadMovies={loadMovies} />
        )}
      </div>
      {APIStatus.Failed ? (
        <p className="flow-text red-text center">{APIStatus.FailMessage}</p>
      ) : (
        ""
      )}
      {FilteredArray && FilteredArray.length ? (
        <div className="col s12 right-align">
          <Pagination
            hideFirstLastPages
            prevPageText="<"
            nextPageText=">"
            activePage={activePage}
            itemsCountPerPage={20}
            totalItemsCount={totalResults}
            pageRangeDisplayed={5}
            onChange={HandlePageChange}
            innerClass="custom_pagination"
          />
        </div>
      ) : null}
    </div>
  );
};

export default Home;
