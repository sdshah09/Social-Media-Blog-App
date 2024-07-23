import React, { useState } from "react";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../firebase";
import AuthForm from "../../components/forms/AuthForm"
const Register = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const config = {
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT, // confirmation email redirect link
      handleCodeInApp: true,
    };

    try {
      const result = await sendSignInLinkToEmail(auth, email, config); // sendSignInLinkToEmail expects authInstance, email, config
      // Sends a sign-in email link to the user with the specified email.

      console.log("result is: ", result);
      toast.success(`Sent Email to ${email} to complete your registration`);
      window.localStorage.setItem("emailForRegistration", email);
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
      {loading ? <h4>Loading..</h4> : <h4>Register</h4>}
      <AuthForm email={email} loading={loading} setEmail={setEmail} handleSubmit={handleSubmit} />
    </div>
  );
};

export default Register;
