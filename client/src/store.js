import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
//rootReducer is from index.js but it doesnt need to be specified in path becuase its index.js
import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    //enable the chrome redux dev tool
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
