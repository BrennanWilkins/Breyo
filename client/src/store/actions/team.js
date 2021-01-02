import * as actionTypes from './actionTypes';
import { instance as axios } from '../../axios';
import { addNotif } from './notifications';

export const createTeam = (team, push) => dispatch => {
  dispatch({ type: actionTypes.CREATE_TEAM, team });
  push('/team/' + team.url);
};

export const getActiveTeam = (url, push) => async dispatch => {
  try {
    const res = await axios.get('/team/' + url);
    dispatch({ type: actionTypes.SET_ACTIVE_TEAM, team: res.data.team });
  } catch (err) {
    push('/');
    addNotif('There was an error while loading the team page.');
  }
};
