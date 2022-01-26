import React from "react";
import { IApiCallStatus } from "../common/interfaces";

export type ContextProps = {
  search: string;
  activePage: number;
  totalPages: number;
  totalResults: number;
  fetching: boolean;
  AllRecords: any[];
  FilteredArray: any[];
  genres: number[];
  sortBy: string;
  year: string;
  APIStatus: {
    InProgress: boolean;
    Failed: boolean;
    FailMessage: string;
  };
  currentAPI: string;
  handleChange: (name: string, value: string) => void;
  loadData: (api: Function) => void;
  HandlePageChange: (pageNumber: number) => void;
  init: () => void;
  setAPIState: (obj: IApiCallStatus) => void;
};

export default React.createContext<Partial<ContextProps>>({
  search: "",
  activePage: 1,
  totalPages: 1,
  totalResults: 1,
  fetching: false,
  AllRecords: [],
  FilteredArray: [],
  genres: [],
  sortBy: "",
  year: "",
  APIStatus: {
    InProgress: false,
    Failed: false,
    FailMessage: "",
  },

  currentAPI: "",
  handleChange: (name: string, value: string) => {},
  loadData: (api: Function) => {},
  HandlePageChange: () => {},
  init: () => {},
  setAPIState: () => {},
});
