import React, { useState, useContext } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, googleAuthProvider } from "../../firebase";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

      console.log("User signed in: ", idTokenResult.token);
      toast.success("Sign-in successful!");
      // setLoading(false);
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
      const result = await signInWithPopup(authInstance, googleAuthProvider);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      dispatch({
        type: "LOGGED_IN_USER",
        payload: { email: user.email, token: idTokenResult.token },
      });

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
