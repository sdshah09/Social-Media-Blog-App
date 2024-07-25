import React, { useState, useMemo, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

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
            console.log('CLOUDINARY UPLOAD', response);
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
            console.log('CLOUDINARY_UPLOAD_FAILED', error);
            toast.error("Image upload failed");
          }
        },
        "base64" // output type
      );
    }
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          className="form-control"
          placeholder="Username"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          className="form-control"
          placeholder="Name"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          className="form-control"
          placeholder="Email"
          disabled
        />
      </div>

      <div className="form-group">
        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-control"
          placeholder="Image"
        />
      </div>

      <div className="form-group">
        <label>About</label>
        <textarea
          name="about"
          value={about}
          onChange={handleChange}
          className="form-control"
          placeholder="About"
          disabled={loading}
        />
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={!email || loading}
      >
        Submit
      </button>
    </form>
  );

  return <div className="container p-5">{profileUpdateForm()}</div>;
};

export default Profile;
