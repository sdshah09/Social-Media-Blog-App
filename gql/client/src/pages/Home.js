import React, { useState, useEffect, useContext } from "react";
import { ApolloClient, InMemoryCache, gql, useLazyQuery, useQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {GET_ALL_POSTS} from '../graphql/queries'
// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache()
});


const Home = () => {
  const { data, loading, error } = useQuery(GET_ALL_POSTS);
  const [fetchPosts, { data: lazyData }] = useLazyQuery(GET_ALL_POSTS);
  const [posts, setPosts] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [errorState, setErrorState] = useState(null);

  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = state.user !== null;

  const updateUserName = () => {
    dispatch({
      type: 'LOGGED_IN_USER',
      payload: 'Shaswat Shah'
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      client.query({ query: GET_ALL_POSTS })
        .then(result => {
          setPosts(result.data.allPosts);
          setLoadingState(false);
        })
        .catch(err => {
          setErrorState(err);
          setLoadingState(false);
        });
    } else {
      setLoadingState(false);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="row justify-content-center align-items-center" style={{ height: '80vh' }}>
          <div className="col-md-6 text-center">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title mb-4">Welcome to Our Blog</h2>
                <p className="card-text mb-4">Please log in to view posts and interact with our community.</p>
                <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg">
                  Log In
                </button>
                <p className="mt-3">
                  Don't have an account? <a href="/register">Register here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || loadingState) return <p>Loading...</p>;
  if (error || errorState) return <p>Error: {error ? error.message : errorState.message}</p>;

  return (
    <div className="container">
      <div className="row p-5">
        {posts &&
        posts.map(p => (
          <div className="col-md-4 mb-4" key={p.id}>
            <div className="card h-100 shadow">
              <div className="card-body">
                <h4 className="card-title">{p.title}</h4>
                <p className="card-text">{p.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row p-5">
        <button onClick={() => fetchPosts()} className="btn btn-primary">
          Fetch posts
        </button>
      </div>
      <hr />
      {lazyData && (
        <div className="alert alert-info">
          <pre>{JSON.stringify(lazyData.allPosts, null, 2)}</pre>
        </div>
      )}
      <hr />
      <div className="alert alert-secondary">
        <pre>{JSON.stringify(state.user, null, 2)}</pre>
      </div>
      <hr />
      <button className="btn btn-secondary" onClick={updateUserName}>
        Change user name
      </button>
      <hr />
      <div className="alert alert-light">
        <pre>{JSON.stringify(location, null, 2)}</pre>
      </div>
    </div>
  );
}

export default Home;