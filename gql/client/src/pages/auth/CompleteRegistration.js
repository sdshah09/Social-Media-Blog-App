import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const CompleteRegistration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Retrieve the email from local storage when the component mounts
    const storedEmail = window.localStorage.getItem("emailForRegistration");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []); // Empty dependency array to run once on mount

  const handleSubmit = async(e) => {
      //e is Event
      e.preventDefault(); // so the browser doesn't relod when the user hits submit
      setLoading(true);
      //validation
      if(!email||!password){
        toast.error('Email and password is required')
        return
      }
      try{
        const result = await auth.signInWithEmailLink(email,window.location.href)
        console.log(result);
      }catch(error){
        console.log('register complete error',error.message)
        setLoading(false)
        toast.error(error.message)
      }
  };

  return (
      <div className="contianer p-5">
          {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Register</h4>}
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
              <button className="btn btn-raised btn-primary" disabled={!email || loading}>
                  Submit
              </button>
          </form>
      </div>
  );
};

export default CompleteRegistration;
