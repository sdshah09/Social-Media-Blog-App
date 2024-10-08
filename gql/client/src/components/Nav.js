import React, { Fragment, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { AuthContext } from "../context/authContext";
import Search from './Search';

const Nav = () => {
  const { state, dispatch } = useContext(AuthContext);
  let navigate = useNavigate();
  const { user } = state;

  const logout = async () => {
    await auth.signOut();
    dispatch({
      type: "LOGGED_IN_USER",
      payload: null,
    });
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Navbar
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/users">
              Users <span className="sr-only">(current)</span>
            </Link>
          </li>
          {user && user.email && (
            <li className="nav-item active">
              <Link className="nav-link" to="/profile">
                {user.email.split("@")[0]}{" "}
                <span className="sr-only">(current)</span>
              </Link>
            </li>
          )}
          {!user && (
            <Fragment>
              <li className="nav-item active">
                <Link className="nav-link" to="/login">
                  Login <span className="sr-only">(current)</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            </Fragment>
          )}
          {user && (
            <li className="nav-item">
              <button onClick={logout} className="nav-link btn btn-link">
                Logout
              </button>
            </li>
          )}
        </ul>
        <div className="ml-auto">
          <Search />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
