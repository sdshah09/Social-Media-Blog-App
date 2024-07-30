import React from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

const PostCard = ({
  post,
  showUpdateButton = false,
  showDeleteButton = false,
  handleDelete,
}) => {
  const { image, content, postedBy } = post;
  const navigate = useNavigate();
  return (
    <div className="card text-center" style={{ minHeight: "375px" }}>
      <div className="card-body">
        <Link to={`/post/${post._id}`}>
          <Image image={image} />
        </Link>
        <h4 className="text-primary">@{postedBy.username}</h4>
        <hr />
        <small>{content}</small>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {showDeleteButton && (
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(post._id)}
            >
              Delete
            </button>
          )}
          {showUpdateButton && (
            <button
              onClick={() => navigate(`/post/update/${post._id}`)}
              className="btn btn-warning"
            >
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
