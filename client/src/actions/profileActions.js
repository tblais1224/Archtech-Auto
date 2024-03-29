import axios from "axios";
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER
} from "./types";

//get the current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

//create profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profile", profileData)
    //redirect to dashboard
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

//clear the current profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

//delete entire account and profile
export const deleteAccount = () => dispatch => {
  if (
      //sends a window alert and asks for confirmation
    window.confirm(
      "Are you sure you want to delete your entire account and profile? This CANNOT be undone!"
    )
  ) {
    axios
      .delete("/api/profile")
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};


//get all the profiles (public)
export const getProfiles = id => dispatch => {
  //adds spinner
  dispatch(setProfileLoading())
  axios
    .get(`/api/profile/all`)
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

//get profile by handle
export const getProfileByHandle = handle => dispatch => {
  //adds spinner
  dispatch(setProfileLoading())
  axios
    .get(`/api/profile/handle/${handle}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};