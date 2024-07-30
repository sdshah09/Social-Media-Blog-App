import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import {  useLazyQuery } from "@apollo/client";
import { SINGLE_POST } from "../../graphql/queries";
import { useParams } from "react-router";
import PostCard from "../../components/PostCard";

const SinglePost = () => {
  const [values, setValues] = useState({
    content: "",
    image: {
      url: "",
      public_id: "",
    },
    postedBy:{}
  });

  const { postId } = useParams(); // postid

  const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);

  const loadSinglePost = useCallback(() => {
    getSinglePost({
      variables: { postId },
    });
  }, [getSinglePost, postId]);

  useMemo(() => {
    if (singlePost) {
      setValues({
        _id: singlePost.singlePost._id,
        content: singlePost.singlePost.content,
        image: singlePost.singlePost.image,
        postedBy: singlePost.singlePost.postedBy
      });
    }
  }, [singlePost]);

  useEffect(() => {
    loadSinglePost();
  }, [loadSinglePost]);

  const { content } = values; // Destructure content from values

  return (
    <div className="container p-5">

      <PostCard post={values}/>
    </div>
  );
};

export default SinglePost;
