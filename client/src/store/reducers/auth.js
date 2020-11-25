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
      const boards = [...state.boards];
      const boardIndex = boards.findIndex(board => board.boardID === action.boardID);
      const board = { ...boards[boardIndex] };
      board.isAdmin = false;
      boards[boardIndex] = board;
      return { ...state, boards };
    }
    case actionTypes.PROMOTE_SELF: {
      const boards = [...state.boards];
      const boardIndex = boards.findIndex(board => board.boardID === action.boardID);
      const board = { ...boards[boardIndex] };
      board.isAdmin = true;
      boards[boardIndex] = board;
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
      const boards = [...state.boards];
      const boardIndex = boards.findIndex(board => board.boardID === action.boardID);
      const board = { ...boards[boardIndex] };
      board.title = action.title;
      boards[boardIndex] = board;
      return { ...state, boards };
    }
    case actionTypes.UPDATE_COLOR: {
      const boards = [...state.boards];
      const boardIndex = boards.findIndex(board => board.boardID === action.boardID);
      const board = { ...boards[boardIndex] };
      board.color = action.color;
      boards[boardIndex] = board;
      return { ...state, boards };
    }
    case actionTypes.AUTO_LOGIN_LOADING: return { ...state, autoLoginLoading: action.bool };
    default: return state;
  }
};

export default reducer;
