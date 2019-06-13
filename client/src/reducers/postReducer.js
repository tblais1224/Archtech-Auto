import {
    ADD_SELLING,
    GET_SELLINGS,
    GET_SELLING,
    DELETE_SELLING,
    SELLING_LOADING
  } from "../actions/types";
  
  const intitialState = {
    sellings: [],
    selling: {},
    loading: false
  };
  
  export default function(state = intitialState, action) {
    switch (action.type) {
      case SELLING_LOADING:
        return {
          ...state,
          loading: true
        };
      case GET_SELLINGS:
        return {
          ...state,
          sellings: action.payload,
          loading: false
        };
      case GET_SELLING:
        return {
          ...state,
         selling: action.payload,
          loading: false
        };
      case ADD_SELLING:
        return {
          ...state,
          sellings: [action.payload, ...state.posts]
        };
      case DELETE_SELLING:
        return {
          ...state,
          //quickly filters out the deleted item locally so it doesnt have to wait for axios
          sellings: state.sellings.filter(selling => selling._id !== action.payload)
        };
      default:
        return state;
    }
  }
  