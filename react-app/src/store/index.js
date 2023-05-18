import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import postReducer from './post';
import commentReducer from './comment';
import postLikesReducer from './postLike';
import commentLikesReducer from "./commentLike"
import subredditReducer from './subreddit';

const rootReducer = combineReducers({
  session: sessionReducer,
  post: postReducer,
  postLikes: postLikesReducer,
  commentLikes: commentLikesReducer,
  subreddits: subredditReducer,
  comments: commentReducer
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
