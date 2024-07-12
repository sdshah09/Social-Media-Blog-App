import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache()
});

const GET_POSTS = gql`
  {
    allPost {
      id
      title
      description
    }
  }
`;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    client.query({ query: GET_POSTS })
      .then(result => {
        setPosts(result.data.allPost);
        setLoading(false);
      })
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
      <div className="container">
        <div className="row p-5">
          {posts.map(p => (
            <div className="col-md-4" key={p.id}>
              <div className="card">
                <div className="card-body">
                  <div className="card-title">
                    <h4>{p.title}</h4>
                  </div>
                  <p className="card-text">{p.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

  );
}

export default Home;
