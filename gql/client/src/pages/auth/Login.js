import React, { useState, useContext } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const USER_CREATE = gql`
  mutation userCreate($email: String!) {
    userCreate(email: $email) {
      username
      email
    }
  }
`;

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [userCreate] = useMutation(USER_CREATE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authInstance = getAuth();
      const result = await signInWithEmailAndPassword(authInstance, email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      dispatch({
        type: "LOGGED_IN_USER",
        payload: { email: user.email, token: idTokenResult.token },
      });
      window.localStorage.setItem('authToken', idTokenResult.token);

      await userCreate({ variables: { email: user.email } });

      console.log("User signed in: ", idTokenResult.token);
      toast.success("Sign-in successful!");
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error during sign-in: ", error);
      toast.error("Failed to sign in: " + error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const authInstance = getAuth();
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      const result = await signInWithPopup(authInstance, provider);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      // Extract email from providerData
      const email = user.email || (user.providerData && user.providerData.length > 0 && user.providerData[0].email);
      console.log("Email in Google Login is: ", email);

      if (!email) {
        throw new Error("Failed to retrieve email from Google login.");
      }

      dispatch({
        type: "LOGGED_IN_USER",
        payload: { email, token: idTokenResult.token },
      });

      await userCreate({ variables: { email } });

      console.log("User signed in with Google: ", user);
      toast.success("Google sign-in successful!");
      navigate("/");
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
      toast.error("Failed to sign in with Google: " + error.message);
    }
  };

  return (
    <div className="container p-5">
      {loading ? <h4>Loading...</h4> : <h4>Sign In</h4>}
      <button onClick={googleLogin} className="btn btn-raised btn-danger mt-5">
        Login With Google
      </button>
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
        <button className="btn btn-raised btn-primary" disabled={loading}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
