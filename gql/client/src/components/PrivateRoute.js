import React, { useEffect, useState, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  const [user, setUser] = useState(false);

  useEffect(() => {
    if (state.user) {
      setUser(true);
    }
  }, [state.user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const navLinks = () => (
    <nav>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/update/profile">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/update/password">
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

  return (
    <div className="container-fluid pt-5">
      <div className="row">
        <div className="col-md-4">
          {navLinks()}
        </div>
        <div className="col-md-8">
          {children ? children : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default PrivateRoute;
