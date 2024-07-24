import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import AuthForm from "../../components/forms/AuthForm";

const PasswordForgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        `Email is sent to ${email}. Click the link to reset your password.`
      );
      setEmail("");
      setLoading(false);
    } catch (error) {
      console.error("Error sending email link", error);
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
          <h4>Forgot Password</h4>
        </>
      )}
      <AuthForm
        email={email}
        setEmail={setEmail}
        loading={loading}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default PasswordForgot;
