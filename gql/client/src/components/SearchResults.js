import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@apollo/client";
import { SEARCH } from "../graphql/queries";
import PostCard from "../components/PostCard";
const SearchResult = () => {
  //route query
  const { query } = useParams();

  //gql query
  const { data, loading } = useQuery(SEARCH, {
    variables: { query },
  });
  if (loading) {
    return (
      <div className="container text-center">
        <p className="text-danger-p-5">loading...</p>
      </div>
    );
  }
  if (!data.search.length) {
    return (
      <div className="container">
        <div className="row pb-5">No results</div>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="row pb-5">
        {data.search.map((post) => (
          <div className="col-md-4 pt-5" key={post._id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
