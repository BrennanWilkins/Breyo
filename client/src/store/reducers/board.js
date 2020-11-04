import * as actionTypes from '../actions/actionTypes';
const Entities = require('entities');

const initialState = {
  title: '',
  members: [],
  color: 'rgb(250, 250, 250)',
  activity: [],
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
      activity: [...action.payload.activity],
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
      const updatedMembers = [...state.members].map(member => ({ ...member }));
      const index = updatedMembers.find(member => member.email === action.email);
      updatedMembers[index].isAdmin = true;
      return {
        ...state,
        members: updatedMembers
      };
    }
    case actionTypes.REMOVE_ADMIN: {
      const updatedMembers = [...state.members].map(member => ({ ...member }));
      const index = updatedMembers.find(member => member.email === action.email);
      updatedMembers[index].isAdmin = false;
      return {
        ...state,
        members: updatedMembers
      };
    }
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
