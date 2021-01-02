import * as actionTypes from '../actions/actionTypes';

const initialState = {
  teamID: '',
  url: '',
  desc: '',
  members: [],
  title: '',
  logo: null,
  boards: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_TEAM: return setActiveTeam(state, action);
    default: return state;
  }
};

const setActiveTeam = (state, action) => ({
  ...state,
  teamID: action.team._id,
  url: action.team.url,
  desc: action.team.desc,
  members: action.team.members,
  title: action.team.title,
  logo: action.team.logo,
  boards: action.team.boards
});

export default reducer;
