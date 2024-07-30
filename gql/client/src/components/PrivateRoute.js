import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import LoadingToRedirect from "./LoadingToRedirect";
import "./PrivateRoute.css"; // Custom CSS file for additional styles

const PrivateRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  const [user, setUser] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    if (state.user) {
      setUser(true);
    } else {
      setUser(false);
      navigate("/login");
    }
  }, [state.user, navigate]);

  const navLinks = () => (
    <nav className="nav-links">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/profile">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/password/update">
            Password
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/post/create">
            Post
          </Link>
        </li>
      </ul>
    </nav>
  );

  return user ? (
    <div className="container-fluid private-route-container">
      <div className="row">
        <div className="col-md-2 nav-container">{navLinks()}</div>
        <div className="col-md-10 content-container">{children}</div>
      </div>
    </div>
  ) : (
    <LoadingToRedirect path="/login" />
  );
};

export default PrivateRoute;
