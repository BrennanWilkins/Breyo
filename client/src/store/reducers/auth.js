import * as actionTypes from '../actions/actionTypes';
import { findAndReplace, findAndToggle } from './reducerUtils';

const initialState = {
  isAuth: false,
  fullName: '',
  email: '',
  invites: [],
  boards: [],
  loginLoading: false,
  loginErr: false,
  loginErrMsg: '',
  signupLoading: false,
  signupErr: false,
  signupErrMsg: '',
  autoLoginLoading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return {
      ...state,
      isAuth: true,
      fullName: action.payload.fullName,
      email: action.payload.email,
      invites: action.payload.invites,
      boards: action.payload.boards,
      loginLoading: false,
      loginErr: false,
      loginErrMsg: '',
      signupLoading: false,
      signupErr: false,
      signupErrMsg: ''
    };
    case actionTypes.LOGIN_LOADING: return {
      ...state,
      loginLoading: true,
      loginErr: false,
      loginErrMsg: ''
    };
    case actionTypes.SIGNUP_LOADING: return {
      ...state,
      signupLoading: true,
      signupErr: false,
      signupErrMsg: ''
    };
    case actionTypes.LOGIN_ERR: return {
      ...state,
      loginLoading: false,
      loginErr: true,
      loginErrMsg: action.msg
    };
    case actionTypes.SIGNUP_ERR: return {
      ...state,
      signupLoading: false,
      signupErr: true,
      signupErrMsg: action.msg
    };
    case actionTypes.AUTH_RESET: return { ...initialState };
    case actionTypes.LOGOUT: return { ...initialState };
    case actionTypes.CREATE_BOARD: return {
      ...state,
      boards: [...state.boards, {...action.payload}]
    };
    case actionTypes.TOGGLE_IS_STARRED: {
      const boards = findAndToggle(state.boards, 'boardID', action.boardID, 'isStarred');
      return { ...state, boards };
    }
    case actionTypes.UPDATE_USER_DATA: return {
      ...state,
      boards: [...action.boards],
      invites: [...action.invites]
    };
    case actionTypes.DEMOTE_SELF: {
      const boards = findAndReplace(state.boards, 'boardID', action.boardID, 'isAdmin', false);
      return { ...state, boards };
    }
    case actionTypes.PROMOTE_SELF: {
      const boards = findAndReplace(state.boards, 'boardID', action.boardID, 'isAdmin', true);
      return { ...state, boards };
    }
    case actionTypes.DELETE_BOARD: {
      const boards = state.boards.filter(board => board.boardID !== action.boardID);
      return { ...state, boards };
    }
    case actionTypes.REMOVE_INVITE: {
      const invites = state.invites.filter(invite => invite.boardID !== action.boardID);
      return { ...state, invites };
    }
    case actionTypes.LEAVE_BOARD: {
      const boards = state.boards.filter(board => board.boardID !== action.boardID);
      return { ...state, boards };
    }
    case actionTypes.UPDATE_BOARD_TITLE: {
      const boards = findAndReplace(state.boards, 'boardID', action.boardID, 'title', action.title);
      return { ...state, boards };
    }
    case actionTypes.UPDATE_COLOR: {
      const boards = findAndReplace(state.boards, 'boardID', action.boardID, 'color', action.color);
      return { ...state, boards };
    }
    case actionTypes.AUTO_LOGIN_LOADING: return { ...state, autoLoginLoading: action.bool };
    default: return state;
  }
};

export default reducer;
