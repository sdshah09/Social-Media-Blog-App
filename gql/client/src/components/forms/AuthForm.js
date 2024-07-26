import React from "react";
import './styles.css'
const AuthForm = ({
  email = "",
  password = "",
  loading,
  setEmail = (f) => f,
  setPassword,
  handleSubmit,
  showPasswordInput = false,
  hideInputemail = false,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {!hideInputemail && (
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
      )}
      {showPasswordInput && (
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
      )}
      <div className="text-center mt-3">
        <button
          className="btn btn-primary btn-submit"
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          Submit
        </button>
      </div>

    </form>
  );
};

export default AuthForm;
