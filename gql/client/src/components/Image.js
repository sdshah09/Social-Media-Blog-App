import React from 'react';

const Image = ({ image, handleImageRemove = (f) => f, openImageModal, loading }) => (
  <div className="image-item">
    <img
      src={image.url}
      key={image.public_id}
      alt={image.public_id}
      style={{height:'100px'}}
      className="img-thumbnail m-3"
      onClick={() => openImageModal(image)}
    />
  </div>
);

export default Image;
