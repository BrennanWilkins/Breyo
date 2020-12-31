import * as actionTypes from './actionTypes';

export const createTeam = (team, push) => dispatch => {
  dispatch({ type: actionTypes.CREATE_TEAM, team });
  if (team.url !== '') { push('/team/' + team.url); }
  else { push('/team/' + team.teamID); }
};
