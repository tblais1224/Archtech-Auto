import {combineReducers} from "redux"
import authReducer from "./authReducer"
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer"
import postReducer from "./postReducer"
import sellingReducer from "./sellingReducer"

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    profile: profileReducer,
    post: postReducer,
    selling: sellingReducer,
})