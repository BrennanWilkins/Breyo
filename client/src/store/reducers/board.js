import * as actionTypes from '../actions/actionTypes';
const Entities = require('entities');

const initialState = {
  title: '',
  members: [],
  color: 'rgb(250, 250, 250)',
  boardID: '',
  creatorEmail: '',
  creatorFullName: '',
  desc: '',
  refreshEnabled: true,
  isStarred: false,
  userIsAdmin: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_ACTIVE_BOARD: return {
      ...state,
      title: Entities.decode(action.payload.title),
      members: [...action.payload.members],
      color: action.payload.color,
      boardID: action.payload._id,
      creatorEmail: action.payload.creatorEmail,
      desc: Entities.decode(action.payload.desc),
      refreshEnabled: action.refreshEnabled,
      isStarred: action.isStarred,
      creatorFullName: action.creatorFullName,
      userIsAdmin: action.userIsAdmin
    };
    case actionTypes.UPDATE_BOARD_TITLE: return {
      ...state,
      title: action.title
    };
    case actionTypes.ADD_ADMIN: {
      const members = [...state.members];
      const index = members.findIndex(member => member.email === action.email);
      members[index].isAdmin = true;
      return { ...state, members };
    }
    case actionTypes.REMOVE_ADMIN: {
      const members = [...state.members];
      const index = members.findIndex(member => member.email === action.email);
      members[index].isAdmin = false;
      return { ...state, members };
    }
    case actionTypes.DEMOTE_SELF: return { ...state, userIsAdmin: false };
    case actionTypes.UPDATE_COLOR: return {
      ...state,
      color: action.color
    }
    case actionTypes.UPDATE_BOARD_DESC: return {
      ...state,
      desc: action.desc
    };
    case actionTypes.UPDATE_REFRESH_ENABLED: {
      const refreshEnabled = !state.refreshEnabled;
      return { ...state, refreshEnabled };
    }
    case actionTypes.DELETE_BOARD: return { ...initialState };
    case actionTypes.TOGGLE_IS_STARRED_ACTIVE: return { ...state, isStarred: !state.isStarred };
    default: return state;
  }
};

export default reducer;
