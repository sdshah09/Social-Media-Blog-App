import React, { useState, useEffect, useContext } from "react";
import { ApolloClient, InMemoryCache, gql, useLazyQuery, useQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const { data, loading, error } = useQuery(GET_POSTS);
  const [fetchPosts, { data: lazyData }] = useLazyQuery(GET_POSTS);
  const [posts, setPosts] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [errorState, setErrorState] = useState(null);

  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const updateUserName = () => {
    dispatch({
      type: 'LOGGED_IN_USER',
      payload: 'Shaswat Shah'
    });
  };

  useEffect(() => {
    client.query({ query: GET_POSTS })
      .then(result => {
        setPosts(result.data.allPost);
        setLoadingState(false);
      })
      .catch(err => {
        setErrorState(err);
        setLoadingState(false);
      });
  }, []);

  if (loading || loadingState) return <p>Loading...</p>;
  if (error || errorState) return <p>Error: {error ? error.message : errorState.message}</p>;

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
      <div className="row p-5">
        <button onClick={() => fetchPosts()} className="btn btn-raised btn-primary">
          Fetch posts
        </button>
      </div>
      <hr />
      {lazyData && JSON.stringify(lazyData.allPost)}
      <hr />
      {JSON.stringify(state.user)}
      <hr />
      <button className="btn btn-primary" onClick={updateUserName}>
        Change user name
      </button>
      <hr />
      <pre>{JSON.stringify(location, null, 2)}</pre>
    </div>
  );
}

export default Home;
