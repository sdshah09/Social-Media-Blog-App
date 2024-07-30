import React, { useState, useMemo, useEffect, Fragment, useCallback } from "react";
import { toast } from "react-toastify";
import { useMutation, useLazyQuery } from "@apollo/client";
import { SINGLE_POST } from "../../graphql/queries";
import { useParams } from "react-router";
import FileUpload from "../../components/FileUpload";
import { POST_UPDATE } from "../../graphql/mutations";

const omitTypename = (key, value) => (key === "__typename" ? undefined : value);

const PostUpdate = () => {
  const [values, setValues] = useState({
    content: "",
    image: {
      url: "",
      public_id: "",
    },
  });

  const { postId } = useParams(); // postid

  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);
  const [loading, setLoading] = useState(false);
  const [postUpdate] = useMutation(POST_UPDATE);

  const loadSinglePost = useCallback(() => {
    getSinglePost({
      variables: { postId },
    });
  }, [getSinglePost, postId]);

  useMemo(() => {
    if (singlePost) {
      const cleanData = JSON.parse(
        JSON.stringify(singlePost.singlePost),
        omitTypename
      );
      setValues({
        _id: cleanData._id,
        content: cleanData.content,
        image: cleanData.image,
      });
    }
  }, [singlePost]);

  useEffect(() => {
    loadSinglePost();
  }, [loadSinglePost]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Values in handleSubmit of Post update: ", values);
    await postUpdate({ variables: { input: values } });
    setLoading(false);
    toast.success("Post Update Successfully");
  };

  const { content } = values; // Destructure content from values

  const updateForm = () => (
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
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <Fragment>
          <div className="row">
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
              <h4>Update</h4>
              {updateForm()}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default PostUpdate;
