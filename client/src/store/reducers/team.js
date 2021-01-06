import * as actionTypes from '../actions/actionTypes';

const initialState = {
  teamID: '',
  url: '',
  desc: '',
  members: [],
  title: '',
  logo: null,
  userIsAdmin: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_TEAM: return setActiveTeam(state, action);
    case actionTypes.EDIT_TEAM: return editTeam(state, action);
    case actionTypes.CHANGE_TEAM_LOGO: return { ...state, logo: action.logo };
    case actionTypes.REMOVE_TEAM_LOGO: return { ...state, logo: null };
    case actionTypes.DELETE_TEAM: return { ...initialState };
    case actionTypes.LOGOUT: return { ...initialState };
    case actionTypes.PROMOTE_TEAM_MEMBER: return promoteTeamMember(state, action);
    case actionTypes.DEMOTE_TEAM_MEMBER: return demoteTeamMember(state, action);
    case actionTypes.DEMOTE_SELF_TEAM_MEMBER: return { ...state, userIsAdmin: false };
    default: return state;
  }
};

const setActiveTeam = (state, action) => ({
  ...state,
  teamID: action.team._id,
  url: action.team.url,
  desc: action.team.desc,
  members: action.team.members.map(member => ({
    email: member.email,
    fullName: member.fullName,
    avatar: member.avatar,
    isAdmin: action.team.admins.includes(member._id)
  })),
  title: action.team.title,
  logo: action.team.logo,
  userIsAdmin: action.team.userIsAdmin
});

const editTeam = (state, action) => {
  if (state.teamID !== action.payload.teamID) { return state; }
  return {
    ...state,
    url: action.payload.url,
    desc: action.payload.desc,
    title: action.payload.title
  };
};

const promoteTeamMember = (state, action) => {
  const members = [...state.members];
  const index = members.findIndex(member => member.email === action.email);
  const member = { ...members[index], isAdmin: true };
  members[index] = member;
  return { ...state, members };
};

const demoteTeamMember = (state, action) => {
  const members = [...state.members];
  const index = members.findIndex(member => member.email === action.email);
  const member = { ...members[index], isAdmin: false };
  members[index] = member;
  return { ...state, members };
};

export default reducer;
