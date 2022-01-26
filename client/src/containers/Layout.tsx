import React, { useState } from "react";
import Navbar from "./Nav";
import Content from "./Content";
import Search from "../controls/Search";
import searchContext from "../context/state-context";
import { IApiCallStatus, IGenre } from "../common/interfaces";
import { getMovieGenres } from "../common/api/movie";
import { useLocation } from "react-router-dom";
import SearchInputs from "../controls/SearchInputs";

const Layout: React.FC = (): React.ReactElement => {
  const [search, setSearch] = useState<string>("");
  const [allGenres, setAllGenres] = useState<IGenre[]>([]);
  const [genres, setGenres] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [activePage, setActivePage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(1);
  const [AllRecords, setAllRecords] = useState<any[]>([]);
  const [FilteredArray, setFilteredArray] = useState<any[]>([]);
  const [APIStatus, setAPIStatus] = useState<IApiCallStatus>({
    InProgress: false,
    Failed: false,
    FailMessage: "",
  });

  const [fetching, setFetching] = useState<boolean>(false);

  const location = useLocation();

  const init = (): void => {
    setAllRecords([]);
    setFilteredArray([]);
    setSearch("");
    setActivePage(1);
    setAPIStatus({
      InProgress: false,
      Failed: false,
      FailMessage: "",
    });
    if (!allGenres || !allGenres.length) {
      getAllGenres();
    }
  };

  const getAllGenres = async (): Promise<void> => {
    try {
      setAPIStatus({
        ...APIStatus,
        InProgress: true,
      });

      let result = await getMovieGenres();

      if (!result.data && result.error) {
        throw new Error(result.error);
      }

      if (!result.data.genres || !result.data.genres.length)
        throw new Error("Could not find genres");

      setAllGenres(result.data.genres);
    } catch (err: any) {
      setAPIStatus({
        ...APIStatus,
        Failed: true,
        FailMessage: err.message,
      });
    } finally {
      setFetching(false);
      setAPIStatus({
        ...APIStatus,
        InProgress: false,
      });
    }
  };

  const setAPIState = (obj: IApiCallStatus): void => {
    setAPIStatus(obj);
  };

  const handleChange = (name: string, value: string): void => {
    switch (name) {
      case "search": {
        setSearch(value);
        break;
      }
      case "sort": {
        setSortBy(value);
        break;
      }
      case "genre": {
        const temp = [...genres];
        const val = Number(value);
        temp.includes(val) ? temp.splice(temp.indexOf(val), 1) : temp.push(val);

        setGenres([...temp]);
        break;
      }
      case "year": {
        if (Number(value) > new Date().getFullYear()) return;

        setYear(value);

        break;
      }
      default:
        return;
    }
  };

  const loadData = async (api: Function): Promise<void> => {
    try {
      setFetching(true);
      setAPIStatus({
        ...APIStatus,
        InProgress: true,
      });

      let result = await api();

      if (!result.data && result.error) {
        throw new Error(result.error);
      }

      const movies = result.data;

      setTotalPages(result.totalPages);
      setTotalResults(result.totalResults);

      if (movies && movies.length) {
        setFilteredArray([...movies]);
        setAllRecords([...movies]);
      }
    } catch (err: any) {
      setAPIStatus({
        ...APIStatus,
        Failed: true,
        FailMessage: err.message,
      });
    } finally {
      setFetching(false);
      setAPIStatus({
        ...APIStatus,
        InProgress: false,
      });
    }
  };

  const HandlePageChange = (pageNumber: number): void => {
    setActivePage(pageNumber);

    if (search !== "") {
      return;
    }
  };

  return (
    <React.Fragment>
      <searchContext.Provider
        value={{
          search,
          activePage,
          totalPages,
          totalResults,
          fetching,
          AllRecords,
          FilteredArray,
          genres,
          sortBy,
          year,
          APIStatus,
          handleChange,
          loadData,
          HandlePageChange,
          init,
          setAPIState,
        }}
      >
        <div className="row">
          <div className="col s2">
            <div className="">
              <Navbar />
            </div>
          </div>

          <div className="col s10 main-area">
            <div className="col s9">
              <Search
                search={search}
                handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e.target.name, e.target.value)
                }
              />
            </div>
            <div className="col s9">
              {location.pathname === "/" ||
              location.pathname.match(/favourite/) ? (
                <SearchInputs
                  handleChange={handleChange}
                  allGenres={allGenres}
                  genres={genres}
                  year={year}
                  sortBy={sortBy}
                />
              ) : null}
            </div>

            <Content />
          </div>
        </div>
      </searchContext.Provider>
    </React.Fragment>
  );
};

export default Layout;
