import React, { useState, Fragment, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import FileUpload from "../../components/FileUpload";
import { POST_CREATE } from "../../graphql/mutations";
import { POST_BY_USER } from "../../graphql/queries";
import PostCard from "../../components/PostCard"; // Assuming you have a PostCard component
import { AuthContext } from "../../context/authContext";
import { POST_DELETE } from "../../graphql/mutations";

const initialState = {
  content: "",
  image: {
    url: "https://placehold.co/200x200.png?text=Post",
    public_id: "123",
  },
};

const Post = () => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
  } = useQuery(POST_BY_USER);

  // Destructure values
  const { content, image } = values;

  // Mutation
  const [postCreate] = useMutation(POST_CREATE, {
    onCompleted: (data) => {
      console.log(data);
      setValues(initialState);
      setLoading(false);
      toast.success("Post Created");
    },
    onError: (err) => {
      console.error(err);
      setLoading(false);
      toast.error("Post creation failed");
    },
    update: (cache, { data: { postCreate } }) => {
      // Update the cache to reflect the newly created post
      const { postByUser } = cache.readQuery({ query: POST_BY_USER });
      cache.writeQuery({
        query: POST_BY_USER,
        data: { postByUser: [postCreate, ...postByUser] },
      });
    },
  });

  const [postDelete] = useMutation(POST_DELETE, {
    update: ({ data }) => {
      console.log("post delete mutation", data);
      toast.error("Post deleted");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Post delete failed");
    },
  });

  const handleDelete = async (postId) => {
    let answer = window.confirm("Delete?");
    if (answer) {
      setLoading(true);
      postDelete({
        variables: { postId },
        refetchQueries: [{ query: POST_BY_USER }],
      });
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await postCreate({ variables: { input: values } });
  };

  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const createForm = () => (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={handleChange}
        name="content"
        rows="10"
        className="md-textarea form-control"
        placeholder="Write something cool"
        maxLength={150}
        disabled={loading}
      ></textarea>
      <button
        className="btn btn-primary"
        type="submit"
        disabled={loading || !content}
      >
        Post
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        {loading ? (
          <h4 className="text-danger">Loading...</h4>
        ) : (
          <Fragment>
            <div className="col-md-3">
              <FileUpload
                values={values}
                loading={loading}
                setValues={setValues}
                setLoading={setLoading}
                singleUpload={true}
              />
            </div>
            <div className="col-md-9">
              <h4>Create</h4>
              {createForm()}
            </div>
          </Fragment>
        )}

        <div className="row p-5">
          {postsLoading ? (
            <p>Loading posts...</p>
          ) : postsError ? (
            <p>Error loading posts: {postsError.message}</p>
          ) : (
            postsData &&
            postsData.postByUser.map((p) => (
              <div className="col-md-3 mb-3" key={p._id}>
                <PostCard
                  post={p}
                  handleDelete={handleDelete}
                  showUpdateButton={true}
                  showDeleteButton={true}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
