import React, { useState } from "react";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
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
      const authInstance = getAuth(); // Ensure you get the auth instance correctly
      const result = await sendSignInLinkToEmail(authInstance, email, config); // sendSignInLinkToEmail expects authInstance, email, config
      console.log("result is: ", result);
      // Show toast notification to user about email sent (implementation depends on your toast library)
      toast.success(`Sent Email to ${email} to complete your registration`);
      // Save user email to local storage
      window.localStorage.setItem("emailForRegistration", email);

      // Clear state
      setEmail(""); // We don't want to show the email once after confirm so clearing the email and loading state
      setLoading(false);
    } catch (error) {
      console.error("Error sending email link", error);
      setLoading(false);
    }
  };

  return (
    <div className="container p-5">
        {loading ? (<h4>Loading..</h4>): (<h4>Register</h4>)}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter email"
            disabled={loading}
          />
        </div>
        <button
          className="btn btn-raised btn-primary"
          disabled={!email || loading}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
