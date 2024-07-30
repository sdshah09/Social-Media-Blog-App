import React, { useState } from "react";
import { useNavigate } from "react-router";
const Search = () => {
  const [query, setQuery] = useState("");
    const navigate = useNavigate()
  const handleSubmit = e =>{
    e.preventDefault()
    navigate(`/search/${query}`)

  }
  return (
    <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
      <input
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        className="form-control mr-sm-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
      />
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
        Search / {query}
      </button>
    </form>
  );
};

export default Search;
