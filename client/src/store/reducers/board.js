import * as actionTypes from '../actions/actionTypes';
const Entities = require('entities');

const initialState = {
  title: '',
  members: [],
  color: 'rgb(250, 250, 250)',
  activity: [],
  boardID: '',
  creatorEmail: '',
  desc: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_ACTIVE_BOARD: return {
      ...state,
      title: Entities.decode(action.payload.title),
      members: [...action.payload.members],
      activity: [...action.payload.activity],
      color: action.payload.color,
      boardID: action.payload.boardID,
      creatorEmail: action.payload.creatorEmail,
      desc: Entities.decode(action.payload.desc)
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
    default: return state;
  }
};

export default reducer;
