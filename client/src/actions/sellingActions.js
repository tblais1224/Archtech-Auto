import axios from "axios";

import {
  ADD_SELLING,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_SELLINGS,
  GET_SELLING,
  SELLING_LOADING,
  DELETE_SELLING
} from "./types";

//add a item for sale
export const addSelling = sellingData => dispatch => {
  dispatch(clearErrors())
  axios
    .post("/api/selling", sellingData)
    .then(res =>
      dispatch({
        type: ADD_SELLING,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//get all for sale
export const getSellings = () => dispatch => {
  dispatch(setSellingLoading);
  axios
    .get("/api/selling")
    .then(res =>
      dispatch({
        type: GET_SELLINGS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_SELLINGS,
        payload: null
      })
    );
};

//get item by id
export const getSelling = (id) => dispatch => {
  dispatch(setSellingLoading);
  axios
    .get(`/api/selling/${id}`)
    .then(res =>
      dispatch({
        type: GET_SELLING,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_SELLING,
        payload: null
      })
    );
};

//delete item for sale
export const deleteSelling = id => dispatch => {
  axios
    .delete(`/api/selling/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_SELLING,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//add watching
export const addWatching = id => dispatch => {
  axios
    .post(`/api/selling/watching/${id}`)
    .then(res =>
      dispatch(getsellings())
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//remove watching
export const removeWatching = id => dispatch => {
  axios
    .post(`/api/selling/unwatching/${id}`)
    .then(res =>
      dispatch(getSellings())
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//add a comment
export const addComment = (sellingId, commentData) => dispatch => {
  dispatch(clearErrors())
  axios
    .post(`/api/selling/comment/${sellingId}`, commentData)
    .then(res =>
      dispatch({
        type: GET_SELLING,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//delete a comment
export const deleteComment = (sellingId, commentId) => dispatch => {
  axios
    .delete(`/api/selling/comment/${sellingId}/${commentId}`)
    .then(res =>
      dispatch({
        type: GET_SELLING,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//add comment like
export const addLike = (sellingId, commentId) => dispatch => {
    axios
      .post(`/api/selling/comment/${sellingId}/like/${commentId}`)
      .then(res =>
        dispatch(getSellings())
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };
  
  //remove comment like
  export const removeLike = (sellingId, commentId) => dispatch => {
    axios
      .post(`/api/selling/comment/${sellingId}/unlike/${commentId}`)
      .then(res =>
        dispatch(getSellings())
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };

//set loading state
export const setSellingLoading = () => {
  return {
    type: SELLING_LOADING
  };
};

//clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
