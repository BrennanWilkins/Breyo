import * as actionTypes from './actionTypes';
import { instance as axios } from '../../axios';
import { addNotif } from './notifications';

export const createTeam = payload => dispatch => {
  const { title, teamID, url, token, push } = payload;
  const team = { title, teamID, url, boards: [] };
  axios.defaults.headers.common['x-auth-token'] = token;
  localStorage['token'] = token;
  dispatch({ type: actionTypes.CREATE_TEAM, team });
  push('/team/' + url);
};

export const getActiveTeam = (url, push) => async (dispatch, getState) => {
  try {
    const teamID = getState().auth.teams.find(team => team.url === url).teamID;
    const res = await axios.get('/team/' + teamID);
    dispatch({ type: actionTypes.SET_ACTIVE_TEAM, team: res.data.team });
  } catch (err) {
    push('/');
    dispatch(addNotif('There was an error while loading the team page.'));
  }
};

export const editTeam = payload => ({ type: actionTypes.EDIT_TEAM, payload });
