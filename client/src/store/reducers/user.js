import * as actionTypes from '../actions/actionTypes';

const initialState = {
  fullName: '',
  email: '',
  avatar: null,
  invites: [],
  teamInvites: [],
  boards: {
    byID: {},
    allIDs: []
  },
  teams: {
    byID: {},
    allIDs: []
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.LOGOUT: return { ...initialState };
    case actionTypes.CREATE_BOARD: return createBoard(state, action);
    case actionTypes.TOGGLE_IS_STARRED: return toggleIsStarred(state, action);
    case actionTypes.UPDATE_USER_DATA: return updateUserData(state, action);
    case actionTypes.UPDATE_USER_BOARDS: return updateUserBoards(state, action);
    case actionTypes.DEMOTE_SELF: return changeUserMembership(state, action, false);
    case actionTypes.PROMOTE_SELF: return changeUserMembership(state, action, true);
    case actionTypes.DELETE_BOARD: return deleteBoard(state, action);
    case actionTypes.REMOVE_INVITE: return removeInvite(state, action);
    case actionTypes.LEAVE_BOARD: return deleteBoard(state, action);
    case actionTypes.UPDATE_BOARD_TITLE: return updateBoardTitle(state, action);
    case actionTypes.UPDATE_COLOR: return updateColor(state, action);
    case actionTypes.CHANGE_AVATAR: return { ...state, avatar: action.url };
    case actionTypes.DELETE_AVATAR: return { ...state, avatar: null };
    case actionTypes.CREATE_TEAM: return createTeam(state, action);
    case actionTypes.EDIT_TEAM: return editTeam(state, action);
    case actionTypes.JOIN_TEAM: return joinTeam(state, action);
    case actionTypes.REJECT_TEAM_INVITE: return rejectTeamInvite(state, action);
    case actionTypes.JOIN_BOARD: return joinBoard(state, action);
    case actionTypes.UPDATE_USER_TEAMS: return updateUserTeams(state, action);
    case actionTypes.DEMOTE_SELF_TEAM_MEMBER: return demoteSelfTeamMember(state, action);
    case actionTypes.CHANGE_BOARD_TEAM: return changeBoardTeam(state, action);
    default: return state;
  }
};

const formatUserBoards = boards => {
  const boardsByID = {};
  const allBoardIDs = [];
  for (let board of boards) {
    boardsByID[board.boardID] = board;
    allBoardIDs.push(board.boardID);
  }
  return { boardsByID, allBoardIDs };
};

const formatUserTeams = (teams, adminTeams) => {
  const teamsByID = {};
  const allTeamIDs = [];
  for (let team of teams) {
    teamsByID[team._id] = { teamID: team._id, title: team.title, url: team.url, isAdmin: adminTeams.includes(team._id) };
    allTeamIDs.push(team._id);
  }
  return { teamsByID, allTeamIDs };
};

const login = (state, action) => {
  const { boardsByID, allBoardIDs } = formatUserBoards(action.payload.boards);
  const { teamsByID, allTeamIDs } = formatUserTeams(action.payload.teams, action.payload.adminTeams);
  return {
    ...state,
    fullName: action.payload.fullName,
    email: action.payload.email,
    invites: action.payload.invites,
    teamInvites: action.payload.teamInvites,
    boards: { byID: boardsByID, allIDs: allBoardIDs },
    avatar: action.payload.avatar,
    teams: { byID: teamsByID, allIDs: allTeamIDs }
  };
};

const createBoard = (state, action) => ({
  ...state,
  boards: {
    byID: { ...state.boards.byID, [action.board.boardID]: action.board },
    allIDs: [...state.boards.allIDs, action.board.boardID]
  }
});

const toggleIsStarred = (state, action) => {
  const boardsByID = { ...state.boards.byID };
  const board = { ...boardsByID[action.boardID] };
  board.isStarred = !board.isStarred;
  boardsByID[action.boardID] = board;
  return { ...state, boards: { byID: boardsByID, allIDs: state.boards.allIDs } };
};

const updateUserData = (state, action) => {
  const { boardsByID, allBoardIDs } = formatUserBoards(action.payload.boards);
  const { teamsByID, allTeamIDs } = formatUserTeams(action.payload.teams, action.payload.adminTeams);
  return {
    ...state,
    boards: { byID: boardsByID, allIDs: allBoardIDs },
    invites: action.payload.invites,
    teams: { byID: teamsByID, allIDs: allTeamIDs },
    teamInvites: action.payload.teamInvites
  };
};

const updateUserBoards = (state, action) => {
  const { boardsByID, allBoardIDs } = formatUserBoards(action.boards);
  return { ...state, invites: action.invites, teamInvites: action.teamInvites, boards: { byID: boardsByID, allIDs: allBoardIDs } };
};

const changeUserMembership = (state, action, isAdmin) => {
  const boardsByID = { ...state.boards.byID, [action.boardID]: { ...state.boards.byID[action.boardID], isAdmin } };
  return { ...state, boards: { byID: boardsByID, allIDs: state.boards.allIDs } };
};

const deleteBoard = (state, action) => {
  const boardsByID = { ...state.boards.byID };
  delete boardsByID[action.boardID];
  const allIDs = state.boards.allIDs.filter(boardID => boardID !== action.boardID);
  return { ...state, boards: { byID: boardsByID, allIDs } };
};

const removeInvite = (state, action) => ({
  ...state,
  invites: state.invites.filter(invite => invite.boardID !== action.boardID)
});

const updateBoardTitle = (state, action) => {
  const boardsByID = { ...state.boards.byID, [action.boardID]: { ...state.boards.byID[action.boardID], title: action.title } };
  return { ...state, boards: { byID: boardsByID, allIDs: state.boards.allIDs } };
};

const updateColor = (state, action) => {
  const boardsByID = { ...state.boards.byID, [action.boardID]: { ...state.boards.byID[action.boardID], color: action.color } };
  return { ...state, boards: { byID: boardsByID, allIDs: state.boards.allIDs } };
};

const createTeam = (state, action) => ({
  ...state,
  teams: {
    byID: { ...state.teams.byID, [action.team.teamID]: action.team },
    allIDs: [...state.teams.allIDs, action.team.teamID]
  }
});

const editTeam = (state, action) => {
  const { teamID, url, title } = action.payload;
  const teamsByID = { ...state.teams.byID, [teamID]: { ...state.teams.byID[teamID], url, title } };
  return { ...state, teams: { byID: teamsByID, allIDs: state.teams.allIDs } };
};

const joinTeam = (state, action) => {
  const teamInvites = state.teamInvites.filter(invite => invite.teamID !== action.team.teamID);
  const teamsByID = { ...state.teams.byID, [action.team.teamID]: action.team };
  const allIDs = [...state.teams.allIDs, action.team.teamID];
  return { ...state, teamInvites, teams: { byID: teamsByID, allIDs } };
};

const rejectTeamInvite = (state, action) => ({
  ...state,
  teamInvites: state.teamInvites.filter(invite => invite.teamID !== action.teamID)
});

const joinBoard = (state, action) => ({
  ...state,
  invites: state.invites.filter(invite => invite.boardID !== action.board.boardID),
  boards: {
    byID: { ...state.boards.byID, [action.board.boardID]: action.board },
    allIDs: [...state.boards.allIDs, action.board.boardID]
  }
});

const updateUserTeams = (state, action) => {
  const { teamsByID, allTeamIDs } = formatUserTeams(action.teams, action.adminTeams);
  return { ...state, teams: { byID: teamsByID, allIDs: allTeamIDs } };
};

const demoteSelfTeamMember = (state, action) => {
  const teamsByID = { ...state.teams.byID, [action.teamID]: { ...state.teams.byID[action.teamID], isAdmin: false } };
  return { ...state, teams: { byID: teamsByID, allIDs: state.teams.allIDs } };
};

const changeBoardTeam = (state, action) => ({
  ...state,
  boards: {
    byID: { ...state.boards.byID, [action.boardID]: { ...state.boards.byID[action.boardID], teamID: action.team.teamID } },
    allIDs: state.boards.allIDs
  }
});

export default reducer;
