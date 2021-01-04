import * as actionTypes from '../actions/actionTypes';
import { findAndReplace, findAndToggle } from './reducerUtils';

const initialState = {
  fullName: '',
  email: '',
  avatar: null,
  invites: [],
  boards: [],
  teams: [],
  teamInvites: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.LOGOUT: return { ...initialState };
    case actionTypes.CREATE_BOARD: return { ...state, boards: [...state.boards, action.board] };
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
    case actionTypes.EDIT_TEAM: return editTeam(state, action);
    case actionTypes.JOIN_TEAM: return joinTeam(state, action);
    case actionTypes.REJECT_TEAM_INVITE: return rejectTeamInvite(state, action);
    case actionTypes.JOIN_BOARD: return joinBoard(state, action);
    default: return state;
  }
};

const login = (state, action) => ({
  ...state,
  fullName: action.payload.fullName,
  email: action.payload.email,
  invites: action.payload.invites,
  teamInvites: action.payload.teamInvites,
  boards: action.payload.boards,
  avatar: action.payload.avatar,
  teams: action.payload.teams.map(team => ({ teamID: team._id, title: team.title, url: team.url })),
});

const toggleIsStarred = (state, action) => {
  const boards = findAndToggle(state.boards, 'boardID', action.boardID, 'isStarred');
  return { ...state, boards };
};

const updateUserData = (state, action) => ({
  ...state,
  boards: action.boards,
  invites: action.invites,
  teams: action.teams.map(team => ({ teamID: team._id, title: team.title, url: team.url })),
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

const editTeam = (state, action) => {
  const teams = [...state.teams];
  const teamIndex = teams.findIndex(team => team.teamID === action.payload.teamID);
  const team = { ...teams[teamIndex], url: action.payload.url, title: action.payload.title };
  teams[teamIndex] = team;
  return { ...state, teams };
};

const joinTeam = (state, action) => {
  const teamInvites = state.teamInvites.filter(invite => invite.teamID !== action.team.teamID);
  const teams = [...state.teams, action.team];
  return { ...state, teamInvites, teams };
};

const rejectTeamInvite = (state, action) => {
  const teamInvites = state.teamInvites.filter(invite => invite.teamID !== action.teamID);
  return { ...state, teamInvites };
};

const joinBoard = (state, action) => {
  const invites = state.invites.filter(invite => invite.boardID !== action.board.boardID);
  const boards = [...state.boards, action.board];
  return { ...state, invites, boards };
};

export default reducer;
