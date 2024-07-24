import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const PrivateRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  const [user, setUser] = useState(false);

  useEffect(() => {
    if (state.user) {
      setUser(true);
    }
  }, [state.user]); // this will run whenever the user logs in or logs out

  const navLinks = () => (
    <nav>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/update/profile">
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
        <div className="col-md-4">
          {navLinks()}
        </div>
        <div className="col-md-8">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <h4>Loading....</h4>
  );
};

export default PrivateRoute;
