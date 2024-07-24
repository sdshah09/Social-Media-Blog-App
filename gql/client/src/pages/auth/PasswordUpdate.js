import React, { useState, Fragment } from "react";
import { toast } from "react-toastify";
import { getAuth, updatePassword,reauthenticateWithCredential } from "firebase/auth";
import AuthForm from "../../components/forms/AuthForm";
import { useNavigate } from "react-router-dom";

const PasswordUpdate = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      await updatePassword(user, password);
      toast.success("Password updated successfully!");
      setLoading(false);
      navigate("/profile")
    } catch (error) {
      console.error("Error updating password", error);
      toast.error(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="container p-5">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <>
          <hr />
          <h4>Update Password</h4>
        </>
      )}
      <AuthForm
        password={password}
        setPassword={setPassword}
        loading={loading}
        handleSubmit={handleSubmit}
        showPasswordInput="true"
        hideInputemail="true"
      />
    </div>
  );
};

export default PasswordUpdate;
