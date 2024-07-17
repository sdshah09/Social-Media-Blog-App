import React, { createContext, useReducer, useEffect } from "react";
import {auth} from '../firebase'
//reducer
const firebaseReducer = (state, action) => {
    switch (action.type) {
        case "LOGGED_IN_USER":
            return { ...state, user: action.payload }
        default:
            return state
    }
}
//state
const initialState = {
    user: "Shaswat Dharmeshkumar Shah"
}

//create context

const AuthContext = createContext()


// context provider
/*A reducer is a function that determines changes to an application's state. It uses the action it receives to determine this change. A reducer function always takes two arguments: the current state and an action. Based on the action type, the reducer function returns a new state. Reducers are a fundamental concept in Redux, but they can also be used with React's useReducer hook for state management in functional components.

 */
const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(firebaseReducer, initialState);

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(async user=>{
            if(user){
                const idTokenResult = await user.getIdTokenResult();
                dispatch({
                    type:'LOGGED_IN_USER',
                    payload: { email: user.email, token: idTokenResult.token }

                })
            }
            else{
                dispatch({
                    type:'LOGGED_IN_USER',
                    payload: null

                })

            }
        })
        //cleanup
        return () => unsubscribe();
    },[])

    const value = { state, dispatch }
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}
// export

export {AuthContext,AuthProvider}