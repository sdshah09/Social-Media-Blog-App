import React, { useState, useMemo, useContext } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation } from "@apollo/client";
import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";
import { AuthContext } from "../../context/authContext";
import { Modal } from "react-bootstrap";
import UserProfile from "../../components/forms/UserProfile";
import FileUpload from "../../components/FileUpload"; // Importing FileUpload component
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

  return (
    <div className="container profile-container">
      <div className="col-md-12 pb-3">
        {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Profile</h4>}
      </div>
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
      <FileUpload
        setValues={setValues}
        setLoading={setLoading}
        values={values}
        loading={loading}
      />
    </div>
  );
};

export default Profile;
