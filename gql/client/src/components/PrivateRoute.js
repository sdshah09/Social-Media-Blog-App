import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import LoadingToRedirect from "./LoadingToRedirect";

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
    <nav>
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
          <Link className="nav-link" to="/create/post">
            Post
          </Link>
        </li>
      </ul>
    </nav>
  );

  return user ? (
    <div className="container-fluid pt-5">
      <div className="row">
        <div className="col-md-4">{navLinks()}</div>
        <div className="col-md-8">{children}</div>
      </div>
    </div>
  ) : (
    <LoadingToRedirect path="/login" />
  );
};

export default PrivateRoute;
