import React, { useState, useMemo, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { Modal } from "react-bootstrap";
import UserProfile from '../../components/forms/UserProfile';
import "./Profile.css";

const omitTypename = (key, value) => (key === "__typename" ? undefined : value);

const Profile = () => {
  const { state } = useContext(AuthContext);
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    about: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data } = useQuery(PROFILE);
  useMemo(() => {
    if (data) {
      console.log(data.profile);
      setValues((prevValues) => ({
        ...prevValues,
        username: data.profile.username,
        name: data.profile.name,
        email: data.profile.email,
        about: data.profile.about,
        images: JSON.parse(JSON.stringify(data.profile.images), omitTypename),
      }));
    }
  }, [data]);

  const [userUpdate] = useMutation(USER_UPDATE, {
    onCompleted: (data) => {
      console.log("user update mutation in profile: ", data);
      toast.success("Profile Updated");
    },
    onError: (error) => {
      console.log("user update error: ", error);
      toast.error("Profile update failed");
    },
  });

  const { username, name, email, about, images } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Values in handleSubmit: ", values);
    setLoading(true);

    const { email, ...updateValues } = values;

    userUpdate({ variables: { input: updateValues } }).finally(() =>
      setLoading(false)
    );
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
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
            setLoading(true);
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
            setValues((prevValues) => ({
              ...prevValues,
              images: [
                ...prevValues.images,
                { url: response.data.url, public_id: response.data.public_id },
              ],
            }));
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
      const filteredImages = images.filter((item) => item.public_id !== id);
      setValues({ ...values, images: filteredImages });
      setLoading(false);
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
    <div className="container profile-container">
      <div className="profile-header">
        <img
          src={
            images.length > 0
              ? images[0].url
              : "https://via.placeholder.com/150"
          }
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-details">
          <h2>{username}</h2>
          <p>{name}</p>
          <p>{about}</p>
        </div>
      </div>
      <UserProfile
        {...values}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
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
        {images.map((image) => (
          <div key={image.public_id} className="image-item">
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
    </div>
  );
};

export default Profile;
