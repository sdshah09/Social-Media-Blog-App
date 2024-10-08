import React, { useContext, useState } from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";
import { Modal } from "react-bootstrap";
import Image from "./Image";

const FileUpload = ({
  setValues,
  setLoading,
  values,
  loading,
  singleUpload = false,
}) => {
  const { state } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (file) {
      Resizer.imageFileResizer(
        file,
        300, // max width
        300, // max height
        "JPEG", // compress format
        100, // quality
        0, // rotation
        async (uri) => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_REST_ENDPOINT}/uploadimages`,
              { image: uri },
              {
                headers: {
                  authtoken: state.user.token,
                },
              }
            );
            console.log("CLOUDINARY UPLOAD", response);

            if (singleUpload) {
              // Single upload: replace the image
              setValues({
                ...values,
                image: {
                  url: response.data.url,
                  public_id: response.data.public_id,
                },
              });
            } else {
              // Multiple uploads: add new image to the array
              setValues((prevValues) => ({
                ...prevValues,
                images: [
                  ...prevValues.images,
                  {
                    url: response.data.url,
                    public_id: response.data.public_id,
                  },
                ],
              }));
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);
            console.log("CLOUDINARY_UPLOAD_FAILED", error);
            toast.error("Image upload failed");
          }
        },
        "base64" // output type
      );
    }
  };

  const handleImageRemove = async (id) => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_REST_ENDPOINT}/removeimage`,
        { public_id: id },
        {
          headers: {
            authtoken: state.user.token,
          },
        }
      );
      setLoading(false);

      if (singleUpload) {
        // Single upload: clear the image
        setValues({
          ...values,
          image: {
            url: "",
            public_id: "",
          },
        });
      } else {
        // Multiple uploads: remove the image from the array
        const filteredImages = values.images.filter(
          (item) => item.public_id !== id
        );
        setValues({ ...values, images: filteredImages });
      }
      toast.success("Image removed successfully");
    } catch (error) {
      setLoading(false);
      console.error("Error removing image", error);
      toast.error("Failed to remove image");
    }
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  return (
    <>
      <div className="form-group">
        <label>Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-control"
        />
      </div>
      <div className="image-grid">
        {singleUpload
          ? values.image &&
            values.image.url && (
              <div
                key={values.image.public_id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <Image image={values.image} openImageModal={openImageModal} />
                <button
                  onClick={() => handleImageRemove(values.image.public_id)}
                  className="btn btn-danger btn-sm mt-2"
                  disabled={loading}
                  style={{ marginTop: "10px" }}
                >
                  Remove
                </button>
              </div>
            )
          : values.images &&
            values.images.map((image) => (
              <div
                key={image.public_id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <Image image={image} openImageModal={openImageModal} />
                <button
                  onClick={() => handleImageRemove(image.public_id)}
                  className="btn btn-danger btn-sm mt-2"
                  disabled={loading}
                  style={{ marginTop: "10px" }}
                >
                  Remove
                </button>
              </div>
            ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={selectedImage?.url}
            alt={selectedImage?.public_id}
            className="img-fluid"
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FileUpload;
