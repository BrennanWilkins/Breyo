import * as actionTypes from '../actions/actionTypes';

const initialState = {
  title: '',
  members: [],
  color: 'rgb(250, 250, 250)',
  boardID: '',
  creatorEmail: '',
  creatorFullName: '',
  desc: '',
  isStarred: false,
  userIsAdmin: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_ACTIVE_BOARD: return {
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
    };
    case actionTypes.UPDATE_BOARD_TITLE: return { ...state, title: action.title };
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
    case actionTypes.PROMOTE_SELF: return { ...state, userIsAdmin: true };
    case actionTypes.UPDATE_COLOR: return { ...state, color: action.color };
    case actionTypes.UPDATE_BOARD_DESC: return { ...state, desc: action.desc };
    case actionTypes.DELETE_BOARD: return { ...initialState };
    case actionTypes.TOGGLE_IS_STARRED_ACTIVE: return { ...state, isStarred: !state.isStarred };
    case actionTypes.LEAVE_BOARD: return { ...initialState };
    case actionTypes.ADD_BOARD_MEMBER: {
      const members = [...state.members];
      members.push({ email: action.email, fullName: action.fullName, isAdmin: false });
      return { ...state, members };
    }
    default: return state;
  }
};

export default reducer;
