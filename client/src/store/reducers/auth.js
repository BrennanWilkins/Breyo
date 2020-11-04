import * as actionTypes from '../actions/actionTypes';

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
  signupErrMsg: ''
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
      const updatedBoards = [...state.boards].map(board => ({ ...board }));
      const index = updatedBoards.findIndex(board => board.boardID === action.id);
      updatedBoards[index].isStarred = !updatedBoards[index].isStarred;
      return { ...state, boards: updatedBoards };
    }
    case actionTypes.UPDATE_USER_DATA: return {
      ...state,
      boards: [...action.boards],
      invites: [...action.invites]
    };
    case actionTypes.DEMOTE_SELF: {
      const updatedBoards = [...state.boards].map(board => ({ ...board }));
      const index = updatedBoards.findIndex(board => board.boardID === action.boardID);
      updatedBoards[index].isAdmin = false;
      return { ...state, boards: updatedBoards };
    }
    case actionTypes.UPDATE_REFRESH_ENABLED: {
      const boards = [...state.boards];
      const index = boards.findIndex(board => board.boardID === action.boardID);
      const board = { ...boards[index] };
      board.refreshEnabled = !board.refreshEnabled;
      boards[index] = board;
      return { ...state, boards };
    }
    default: return state;
  }
};

export default reducer;
