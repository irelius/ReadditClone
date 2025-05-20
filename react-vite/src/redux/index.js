import {
    legacy_createStore as createStore, applyMiddleware,
    compose,
    combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import userReducer from "./user"
import subredditReducer from "./subreddit";
import postReducer from "./post";
import commentReducer from "./comment";
import commentLikesReducer from "./commentLike";
import postLikesReducer from "./postLike";

const rootReducer = combineReducers({
    user: userReducer,
    session: sessionReducer,
    subreddit: subredditReducer,
    post: postReducer,
    postLikes: postLikesReducer,
    comment: commentReducer,
    commentLikes: commentLikesReducer
});

let enhancer;

if (import.meta.env.MODE === "production") {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = (await import("redux-logger")).default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}


const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
