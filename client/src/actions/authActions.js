import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

//Register User
//dispatch is used to send action to the redux store
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    //redirect to route /login after register
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//login user and get auth token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      const { token } = res.data;
      //save the token to the local storage of the client, can only save strings to local storage
      localStorage.setItem("jwtToken", token);
      //set token to the auth header in utils
      setAuthToken(token);
      //decode the token
      const decoded = jwt_decode(token);
      //set the current user from decoded token
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//set the logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

//log user out
export const logoutUser = () => dispatch => {
    //remove the tokn from localstorage
    localStorage.removeItem("jwtToken")
    // delete the authentication header
    setAuthToken(false)
    // set the current user to an empty object which will set isAuth to false
    dispatch(setCurrentUser({}))
}