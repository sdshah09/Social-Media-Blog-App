import React from 'react';

const Image = ({ image, handleImageRemove = (f) => f, openImageModal, loading }) => (
  <div className="image-item">
    <img
      src={image.url}
      alt={image.public_id}
      className="image-preview"
      onClick={() => openImageModal(image)}
    />
    <button
      onClick={() => handleImageRemove(image.public_id)}
      className="btn btn-danger btn-sm"
      disabled={loading}
    >
      Remove
    </button>
  </div>
);

export default Image;
