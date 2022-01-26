import React from "react";
import Input from "./Input";

interface IProps {
  search: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<IProps> = (props: IProps) => {
  const { handleChange, search } = props;

  return (
    <div className="row custom-search">
      <div className="col s12">
        <Input
          type="text"
          onChange={handleChange}
          name="search"
          id="Search"
          icon="search"
          value={search}
        />
      </div>
    </div>
  );
};

export default Search;
