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
    case actionTypes.PROMOTE_TEAM_MEMBER: return toggleTeamAdmin(state, action, true);
    case actionTypes.DEMOTE_TEAM_MEMBER: return toggleTeamAdmin(state, action, false);
    case actionTypes.DEMOTE_SELF_TEAM_MEMBER: return { ...state, userIsAdmin: false };
    case actionTypes.ADD_TEAM_MEMBER: return addTeamMember(state, action);
    case actionTypes.DELETE_TEAM_MEMBER: return deleteTeamMember(state, action);
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

const toggleTeamAdmin = (state, action, isAdmin) => ({
  ...state,
  members: state.members.map(member => member.email === action.email ? { ...member, isAdmin } : member)
});

const addTeamMember = (state, action) => ({
  ...state,
  members: [...state.members, action.member]
});

const deleteTeamMember = (state, action) => ({
  ...state,
  members: state.members.filter(({ email }) => email !== action.email)
});

export default reducer;
