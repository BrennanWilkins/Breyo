import * as actionTypes from '../actions/actionTypes';
import { findAndReplace } from './reducerUtils';

const initialState = {
  title: '',
  members: [],
  color: 'rgb(250, 250, 250)',
  boardID: '',
  creatorEmail: '',
  creatorFullName: '',
  desc: '',
  isStarred: false,
  userIsAdmin: false,
  roadmapShown: false,
  shownRoadmapListID: null,
  showCreateBoard: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_ACTIVE_BOARD: return updateActiveBoard(state, action);
    case actionTypes.UPDATE_BOARD_TITLE: return { ...state, title: action.title };
    case actionTypes.ADD_ADMIN: return addAdmin(state, action);
    case actionTypes.REMOVE_ADMIN: return removeAdmin(state, action);
    case actionTypes.DEMOTE_SELF: return { ...state, userIsAdmin: false };
    case actionTypes.PROMOTE_SELF: return { ...state, userIsAdmin: true };
    case actionTypes.UPDATE_COLOR: return { ...state, color: action.color };
    case actionTypes.UPDATE_BOARD_DESC: return { ...state, desc: action.desc };
    case actionTypes.DELETE_BOARD: return { ...initialState };
    case actionTypes.TOGGLE_IS_STARRED_ACTIVE: return { ...state, isStarred: !state.isStarred };
    case actionTypes.LEAVE_BOARD: return { ...initialState };
    case actionTypes.ADD_BOARD_MEMBER: return addBoardMember(state, action);
    case actionTypes.DELETE_BOARD_MEMBER: return deleteBoardMember(state, action);
    case actionTypes.LOGOUT: return { ...initialState };
    case actionTypes.OPEN_ROADMAP: return { ...state, roadmapShown: true };
    case actionTypes.SET_SHOWN_ROADMAP_LIST: return { ...state, shownRoadmapListID: action.listID };
    case actionTypes.CLOSE_ROADMAP: return { ...state, roadmapShown: false };
    case actionTypes.TOGGLE_CREATE_BOARD: return { ...state, showCreateBoard: !state.showCreateBoard };
    default: return state;
  }
};

const updateActiveBoard = (state, action) => ({
  ...state,
  title: action.payload.title,
  members: action.payload.members,
  color: action.payload.color,
  boardID: action.payload.boardID,
  creatorEmail: action.payload.creatorEmail,
  desc: action.payload.desc,
  isStarred: action.payload.isStarred,
  creatorFullName: action.payload.creatorFullName,
  userIsAdmin: action.payload.userIsAdmin
});

const addAdmin = (state, action) => {
  const members = findAndReplace(state.members, 'email', action.email, 'isAdmin', true);
  return { ...state, members };
};

const removeAdmin = (state, action) => {
  const members = findAndReplace(state.members, 'email', action.email, 'isAdmin', false);
  return { ...state, members };
};

const addBoardMember = (state, action) => {
  const members = [...state.members];
  members.push({ email: action.email, fullName: action.fullName, isAdmin: false });
  return { ...state, members };
};

const deleteBoardMember = (state, action) => {
  const members = state.members.filter(member => member.email !== action.email);
  return { ...state, members };
};

export default reducer;
