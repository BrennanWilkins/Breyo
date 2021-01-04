import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './store/reducers/auth';
import notifsReducer from './store/reducers/notifications';
import boardReducer from './store/reducers/board';
import listsReducer from './store/reducers/lists';
import activityReducer from './store/reducers/activity';
import teamReducer from './store/reducers/team';
import userReducer from './store/reducers/user';

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notifsReducer,
  board: boardReducer,
  lists: listsReducer,
  activity: activityReducer,
  team: teamReducer,
  user: userReducer
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
