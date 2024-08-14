import React, { useState, useContext } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import AuthForm from "../../components/forms/AuthForm";
import { USER_CREATE } from "../../graphql/mutations";

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
      const result = await signInWithEmailAndPassword(
        authInstance,
        email,
        password
      );
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      dispatch({
        type: "LOGGED_IN_USER",
        payload: { email: user.email, token: idTokenResult.token },
      });
      window.localStorage.setItem("authToken", idTokenResult.token);

      await userCreate({ variables: { email: user.email } });

      toast.success("Sign-in successful!");
      setLoading(false);
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to sign in: " + error.message);
      setLoading(false);
      navigate("/");
    }
  };

  const googleLogin = async () => {
    try {
      const authInstance = getAuth();
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      const result = await signInWithPopup(authInstance, provider);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      console.log("User result in google login is : ",user.providerData[0].email);
      dispatch({
        type: "LOGGED_IN_USER",
        payload: { email: user.providerData[0].email, token: idTokenResult.token },
      });
      
      await userCreate({ variables: { email: user.providerData[0].email } });

      toast.success("Google sign-in successful!");
      navigate("/password/update");
    } catch (error) {
      toast.error("Failed to sign in with Google: " + error.message);
      navigate("/");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#f8f9fa",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h4 style={{ textAlign: "center" }}>
          {loading ? "Loading..." : "Sign In"}
        </h4>

        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          handleSubmit={handleSubmit}
          showPasswordInput={true}
        />


        {/* Move the Google Login button here */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            onClick={googleLogin}
            style={{
              backgroundColor: "#d9534f",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Login With Google
          </button>
        </div>
        <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
          <Link style={{ color: "#d9534f", textDecoration: "none" }} to="/password/forgot">
            Forgot Password
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
