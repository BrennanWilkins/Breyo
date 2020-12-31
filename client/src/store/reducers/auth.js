import * as actionTypes from '../actions/actionTypes';
import { findAndReplace, findAndToggle } from './reducerUtils';

const initialState = {
  isAuth: false,
  fullName: '',
  email: '',
  avatar: null,
  invites: [],
  boards: [],
  loginLoading: false,
  loginErr: false,
  loginErrMsg: '',
  signupLoading: false,
  signupErr: false,
  signupErrMsg: '',
  autoLoginLoading: false,
  teams: [],
  teamInvites: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.LOGIN_LOADING: return loginLoading(state, action);
    case actionTypes.SIGNUP_LOADING: return signupLoading(state, action);
    case actionTypes.LOGIN_ERR: return loginErr(state, action);
    case actionTypes.SIGNUP_ERR: return signupErr(state, action);
    case actionTypes.AUTH_RESET: return { ...initialState };
    case actionTypes.LOGOUT: return { ...initialState };
    case actionTypes.CREATE_BOARD: return { ...state, boards: [...state.boards, action.board] };
    case actionTypes.CREATE_TEAM_BOARD: return createTeamBoard(state, action);
    case actionTypes.TOGGLE_IS_STARRED: return toggleIsStarred(state, action);
    case actionTypes.UPDATE_USER_DATA: return updateUserData(state, action);
    case actionTypes.DEMOTE_SELF: return demoteSelf(state, action);
    case actionTypes.PROMOTE_SELF: return promoteSelf(state, action);
    case actionTypes.DELETE_BOARD: return deleteBoard(state, action);
    case actionTypes.REMOVE_INVITE: return removeInvite(state, action);
    case actionTypes.LEAVE_BOARD: return leaveBoard(state, action);
    case actionTypes.UPDATE_BOARD_TITLE: return updateBoardTitle(state, action);
    case actionTypes.UPDATE_COLOR: return updateColor(state, action);
    case actionTypes.AUTO_LOGIN_LOADING: return { ...state, autoLoginLoading: action.bool };
    case actionTypes.CHANGE_AVATAR: return { ...state, avatar: action.url };
    case actionTypes.DELETE_AVATAR: return { ...state, avatar: null };
    case actionTypes.CREATE_TEAM: return { ...state, teams: [...state.teams, action.team] };
    default: return state;
  }
};

const login = (state, action) => ({
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
  signupErrMsg: '',
  avatar: action.payload.avatar
});

const loginLoading = (state, action) => ({
  ...state,
  loginLoading: true,
  loginErr: false,
  loginErrMsg: ''
});

const signupLoading = (state, action) => ({
  ...state,
  signupLoading: true,
  signupErr: false,
  signupErrMsg: ''
});

const loginErr = (state, action) => ({
  ...state,
  loginLoading: false,
  loginErr: true,
  loginErrMsg: action.msg
});

const signupErr = (state, action) => ({
  ...state,
  signupLoading: false,
  signupErr: true,
  signupErrMsg: action.msg
});

const toggleIsStarred = (state, action) => {
  const boards = findAndToggle(state.boards, 'boardID', action.boardID, 'isStarred');
  return { ...state, boards };
};

const updateUserData = (state, action) => ({
  ...state,
  boards: action.boards,
  invites: action.invites,
  teams: action.teams.map(team => ({ teamID: team._id, title: team.title, boards: team.boards, url: team.url })),
  teamInvites: action.teamInvites
});

const demoteSelf = (state, action) => {
  const boards = findAndReplace(state.boards, 'boardID', action.boardID, 'isAdmin', false);
  return { ...state, boards };
};

const promoteSelf = (state, action) => {
  const boards = findAndReplace(state.boards, 'boardID', action.boardID, 'isAdmin', true);
  return { ...state, boards };
};

const deleteBoard = (state, action) => {
  const boards = state.boards.filter(board => board.boardID !== action.boardID);
  return { ...state, boards };
};

const removeInvite = (state, action) => {
  const invites = state.invites.filter(invite => invite.boardID !== action.boardID);
  return { ...state, invites };
};

const leaveBoard = (state, action) => {
  const boards = state.boards.filter(board => board.boardID !== action.boardID);
  return { ...state, boards };
};

const updateBoardTitle = (state, action) => {
  const boards = findAndReplace(state.boards, 'boardID', action.boardID, 'title', action.title);
  return { ...state, boards };
};

const updateColor = (state, action) => {
  const boards = findAndReplace(state.boards, 'boardID', action.boardID, 'color', action.color);
  return { ...state, boards };
};

const createTeamBoard = (state, action) => {
  const teams = [...state.teams];
  const teamIndex = teams.findIndex(team => team.teamID === action.board.teamID);
  const team = { ...teams[teamIndex] };
  team.boards = [...team.boards, action.board.boardID];
  teams[teamIndex] = team;
  const boards = [...state.boards, action.board];
  return { ...state, teams, boards };
};

export default reducer;
