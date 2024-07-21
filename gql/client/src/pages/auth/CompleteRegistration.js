import React, { useState, useEffect, useContext } from "react";
import { getAuth, signInWithEmailLink, updatePassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { gql, useMutation } from "@apollo/client";

const USER_CREATE = gql`
  mutation userCreate {
    userCreate {
      username
      email
    }
  }
`;

const CompleteRegistration = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration") || "");
  }, []);

  const [userCreate] = useMutation(USER_CREATE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast.error("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      if (result.user) {
        await updatePassword(result.user, password);
        window.localStorage.removeItem("emailForRegistration");
        toast.success("Registration complete and password set!");
        const idTokenResult = await result.user.getIdTokenResult();
        dispatch({
          type: "LOGGED_IN_USER",
          payload: { email: result.user.email, token: idTokenResult.token },
        });

        userCreate();

        navigate("/");
      } else {
        throw new Error("Failed to complete registration");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container p-5">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>Complete Registration</h4>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter email"
            disabled
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Enter password"
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

export default CompleteRegistration;
