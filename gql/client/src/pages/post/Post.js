import React, { useState, Fragment } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation } from "@apollo/client";
import FileUpload from "../../components/FileUpload";
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

  // Destructure values
  const { content, image } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
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
            <div className="com-md-3">
              <FileUpload
                values={values}
                loading={loading}
                setValues={setValues}
                setLoading={setLoading}
                singleUpload={true}
              />
            </div>

            <h4>Create</h4>
            {createForm()}
          </Fragment>
        )}

        {JSON.stringify(values.content)}
      </div>
    </div>
  );
};

export default Post;
