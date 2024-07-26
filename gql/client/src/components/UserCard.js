import React, { useState } from "react";
import Image from "./Image";
import Modal from "react-modal"; // Assuming you use react-modal
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  const { username, images, about } = user;
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  // Example loading state
  const loading = false;

  console.log("Username in UserCard is: ", username);

  return (
    <div className="card text-center" style={{ minHeight: "375px" }}>
      <div className="card-body">
        {images && images.length > 0 && (
          <Image
            image={images[0]}
            openImageModal={openImageModal}
            loading={loading}
          />
        )}
        <Link to={`/user?username=${username}`}>
          <h4 className="text-primary">@{username}</h4>
        </Link>
        <hr />
        <small>{about}</small>
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
        >
          <div className="modal-header">
            <button onClick={closeModal} className="close">
              &times;
            </button>
          </div>
          <div className="modal-body">
            <img
              src={selectedImage?.url}
              alt={selectedImage?.public_id}
              className="img-fluid"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserCard;
