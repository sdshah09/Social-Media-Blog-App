import React, { createContext, useReducer, useEffect } from "react";
import { auth } from "../firebase";

// Define the initial state for the context
const initialState = {
  user: null, // It's better to start with `null` to represent no user logged in
};

// Create a context
const AuthContext = createContext(initialState);

// Reducer function for handling state changes
const firebaseReducer = (state, action) => {
  console.log("State and action is: ", action.payload);
  switch (action.type) {
    case "LOGGED_IN_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// Context Provider component
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(firebaseReducer, initialState);

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Get the token result only if the user is logged in
          const idTokenResult = await user.getIdTokenResult();
          console.log("AuthProvider User is: ", user);
          console.log("Token is: ", idTokenResult.token);

          // Check if user email is null
          if (!user.email) {
            console.warn("User email is null, attempting to refresh user info.");
            await user.reload();
            user = auth.currentUser;
            console.log("Updated user after reload: ", user);
          }

          dispatch({
            type: "LOGGED_IN_USER",
            payload: { email: user.email, token: idTokenResult.token },
          });
        } catch (error) {
          console.error("Error retrieving user token:", error);
          // Handle token retrieval error, if necessary
        }
      } else {
        // Dispatch null when no user is logged in
        dispatch({
          type: "LOGGED_IN_USER",
          payload: null,
        });
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  // Provide state and dispatch through context to children
  const value = { state, dispatch };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
