import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const PublicRoute = ({ children }) => {
    const { state } = useContext(AuthContext);
    let navigate = useNavigate();

useEffect(() => {
        if (state.user) {
            navigate("/profile");
        }
    }, [state.user, navigate]);

    return <div className="container-fluid p-5">{children}</div>;
}

export default PublicRoute;
