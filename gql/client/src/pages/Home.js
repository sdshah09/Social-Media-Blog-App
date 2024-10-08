import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery, useQuery, useSubscription } from "@apollo/client";
import { AuthContext } from "../context/authContext";
import { useNavigate, useLocation } from "react-router-dom";
import { GET_ALL_POSTS, TOTAL_POSTS } from "../graphql/queries";
import PostCard from "../components/PostCard";
import PostPagination from "../components/PostPagination"; // Importing the PostPagination component
import { toast } from "react-toastify";
import {
  POST_ADDED,
  POST_UPDATED,
  POST_DELETED,
} from "../graphql/subscriptions";
const Home = () => {
  const [page, setPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0); // State for tracking the current page group
  const pagesPerGroup = 3; // Define how many pages to show per group

  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    variables: { page },
  });
  const { data: postCount } = useQuery(TOTAL_POSTS);
  const [
    fetchPosts,
    { data: lazyData, loading: lazyLoading, error: lazyError },
  ] = useLazyQuery(GET_ALL_POSTS);
  const [posts, setPosts] = useState([]);
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = state.user !== null;
  //subscription
  const { data: newPostData } = useSubscription(POST_ADDED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      // console.log(data)
      // readQuery from cache
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page },
      });
      // console.log(allPosts)

      // write back to cache
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: [data.postAdded, ...allPosts],
        },
      });
      // refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }],
      });
      // show toast notification
      toast.success("New post!");
    },
  });

  const { data: updatedPost } = useSubscription(POST_UPDATED, {
    onSubscriptionData: () => {
      toast.success("Post updated!");
    },
  });

  const { data: deletedPost } = useSubscription(POST_DELETED, {
    onSubscriptionData: async ({
      client: { cache },
      subscriptionData: { data },
    }) => {
      // console.log(data)
      // readQuery from cache
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page },
      });
      // console.log(allPosts)

      let filteredPosts = allPosts.filter(
        (p) => p._id !== data.postDeleted._id
      );

      // write back to cache
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: filteredPosts,
        },
      });
      // refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }],
      });
      // show toast notification
      toast.error("Post deleted!");
    },
  });

  const updateUserName = () => {
    dispatch({
      type: "LOGGED_IN_USER",
      payload: "Shaswat Shah",
    });
  };

  useEffect(() => {
    if (data) {
      console.log("Fetched data:", data); // Debugging log
      setPosts(data.allPosts);
    }
  }, [data]);

  useEffect(() => {
    if (lazyData) {
      console.log("Lazy fetched data:", lazyData); // Debugging log
      setPosts(lazyData.allPosts);
    }
  }, [lazyData]);

  useEffect(() => {
    fetchPosts({ variables: { page } });
  }, [page, fetchPosts]);

  useEffect(() => {
    if (newPostData) {
      console.log("New post added:", newPostData.postAdded); // Debugging log
      setPosts((prevPosts) => [newPostData.postAdded, ...prevPosts]);
    }
  }, [newPostData]);

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div
          className="row justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <div className="col-md-6 text-center">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title mb-4">Welcome to Our Blog</h2>
                <p className="card-text mb-4">
                  Please log in to view posts and interact with our community.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-primary btn-lg"
                >
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

  if (loading || lazyLoading) return <p>Loading...</p>;
  if (error || lazyError)
    return <p>Error: {error ? error.message : lazyError.message}</p>;

  return (
    <div className="container">
      <div className="row p-5">
        {posts.length > 0 ? (
          posts.map((p) => (
            <div className="col-md-4 mb-4" key={p._id}>
              <PostCard post={p} />
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>

      <PostPagination
        page={page}
        setPage={setPage}
        postCount={postCount}
        pagesPerGroup={pagesPerGroup}
        pageGroup={pageGroup}
        setPageGroup={setPageGroup}
      />

      <div className="row p-5">
        <button
          onClick={() => fetchPosts({ variables: { page } })}
          className="btn btn-primary"
        >
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

      {/* <div className="alert alert-secondary">
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
      <div className="alert alert-light">
        <pre>{JSON.stringify(newPostData, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default Home;
