import * as actionTypes from '../actions/actionTypes';

const initialState = {
  title: '',
  members: [],
  color: 'rgb(250, 250, 250)',
  boardID: '',
  creator: {
    email: '',
    fullName: '',
    avatar: null
  },
  desc: '',
  isStarred: false,
  userIsAdmin: false,
  shownView: 'lists',
  showCreateBoard: false,
  createBoardTeamID: null,
  avatars: {},
  customLabels: {
    allIDs: [],
    byID: {}
  },
  customFields: {
    allIDs: [],
    byID: {}
  },
  team: {
    teamID: null,
    title: '',
    url: null
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_ACTIVE_BOARD: return updateActiveBoard(state, action);
    case actionTypes.UPDATE_BOARD_TITLE: return { ...state, title: action.title };
    case actionTypes.ADD_ADMIN: return toggleIsAdmin(state, action, true);
    case actionTypes.REMOVE_ADMIN: return toggleIsAdmin(state, action, false);
    case actionTypes.DEMOTE_SELF: return { ...state, userIsAdmin: false };
    case actionTypes.PROMOTE_SELF: return { ...state, userIsAdmin: true };
    case actionTypes.UPDATE_COLOR: return { ...state, color: action.color };
    case actionTypes.UPDATE_BOARD_DESC: return { ...state, desc: action.desc };
    case actionTypes.DELETE_BOARD: return { ...initialState };
    case actionTypes.TOGGLE_IS_STARRED_ACTIVE: return { ...state, isStarred: !state.isStarred };
    case actionTypes.LEAVE_BOARD: return { ...initialState };
    case actionTypes.ADD_BOARD_MEMBER: return addBoardMember(state, action);
    case actionTypes.DELETE_BOARD_MEMBER: return deleteBoardMember(state, action);
    case actionTypes.LOGOUT: return { ...initialState };
    case actionTypes.TOGGLE_CREATE_BOARD: return toggleCreateBoard(state, action);
    case actionTypes.SET_CREATE_BOARD_TEAM: return setCreateBoardTeam(state, action);
    case actionTypes.CHANGE_BOARD_TEAM: return changeBoardTeam(state, action);
    case actionTypes.REMOVE_BOARD_FROM_TEAM: return removeBoardFromTeam(state, action);
    case actionTypes.SET_SHOWN_BOARD_VIEW: return { ...state, shownView: action.view };
    case actionTypes.CREATE_NEW_CUSTOM_LABEL: return createCustomLabel(state, action);
    case actionTypes.UPDATE_CUSTOM_LABEL: return updateCustomLabel(state, action);
    case actionTypes.DELETE_CUSTOM_LABEL: return deleteCustomLabel(state, action);
    case actionTypes.CREATE_CUSTOM_FIELD: return createCustomField(state, action);
    case actionTypes.UPDATE_CUSTOM_FIELD_TITLE: return updateCustomFieldTitle(state, action);
    case actionTypes.DELETE_CUSTOM_FIELD: return deleteCustomField(state, action);
    case actionTypes.MOVE_CUSTOM_FIELD: return moveCustomField(state, action);
    default: return state;
  }
};

const updateActiveBoard = (state, action) => ({
  ...state,
  title: action.payload.title,
  members: action.payload.members,
  color: action.payload.color,
  boardID: action.payload.boardID,
  creator: action.payload.creator,
  desc: action.payload.desc,
  isStarred: action.payload.isStarred,
  userIsAdmin: action.payload.userIsAdmin,
  team: action.payload.team,
  avatars: action.payload.avatars,
  customLabels: action.payload.customLabels,
  customFields: action.payload.customFields
});

const toggleIsAdmin = (state, action, isAdmin) => ({
  ...state,
  members: state.members.map(member => member.email === action.email ? { ...member, isAdmin } : member)
});

const addBoardMember = (state, action) => ({
  ...state,
  members: [...state.members, { email: action.email, fullName: action.fullName, isAdmin: false, avatar: action.avatar }],
  avatars: { ...state.avatars, [action.email]: action.avatar }
});

const deleteBoardMember = (state, action) => ({
  ...state,
  members: state.members.filter(member => member.email !== action.email)
});

const toggleCreateBoard = (state, action) => ({
  ...state,
  createBoardTeamID: action.teamID || null,
  showCreateBoard: !state.showCreateBoard
});

const setCreateBoardTeam = (state, action) => ({
  ...state,
  createBoardTeamID: action.teamID || null,
});

const changeBoardTeam = (state, action) => ({
  ...state,
  team: {
    teamID: action.team.teamID,
    title: action.team.title,
    url: !state.team.url ? null : action.team.url
  }
});

const removeBoardFromTeam = (state, action) => ({
  ...state,
  team: { teamID: null, title: '', url: null }
});

const createCustomLabel = (state, action) => {
  const allIDs = [...state.customLabels.allIDs, action.labelID];
  const byID = { ...state.customLabels.byID, [action.labelID] : { title: action.title, color: action.color } };
  return { ...state, customLabels: { byID, allIDs } };
};

const updateCustomLabel = (state, action) => {
  const byID = { ...state.customLabels.byID, [action.labelID] : { title: action.title, color: action.color } };
  return { ...state, customLabels: { ...state.customLabels, byID } };
};

const deleteCustomLabel = (state, action) => {
  const byID = { ...state.customLabels.byID };
  delete byID[action.labelID];
  const allIDs = state.customLabels.allIDs.filter(id => id !== action.labelID);
  return { ...state, customLabels: { byID, allIDs } };
};

const createCustomField = (state, action) => {
  const allIDs = [...state.customFields.allIDs, action.fieldID];
  const byID = { ...state.customFields.byID, [action.fieldID] : { fieldTitle: action.fieldTitle, fieldType: action.fieldType } };
  return { ...state, customFields: { byID, allIDs } };
};

const updateCustomFieldTitle = (state, action) => {
  const byID = { ...state.customFields.byID, [action.fieldID] : { ...state.customFields.byID[action.fieldID], fieldTitle: action.fieldTitle } };
  return { ...state, customFields: { ...state.customFields, byID } };
};

const deleteCustomField = (state, action) => {
  const byID = { ...state.customFields.byID };
  delete byID[action.fieldID];
  const allIDs = state.customFields.allIDs.filter(id => id !== action.fieldID);
  return { ...state, customFields: { byID, allIDs } };
};

const moveCustomField = (state, action) => {
  const allIDs = [...state.customFields.allIDs];
  const field = allIDs.splice(action.sourceIndex, 1)[0];
  allIDs.splice(action.destIndex, 0, field);
  return { ...state, customFields: { byID: state.customFields.byID, allIDs } };
};

export default reducer;
