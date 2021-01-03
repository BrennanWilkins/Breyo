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

export const changeTeamLogo = (img, teamID) => async dispatch => {
  const errHandler = () => dispatch(addNotif('There was an error while uploading your logo.'));
  const reader = new FileReader();
  reader.readAsDataURL(img);

  reader.onloadend = () => {
    axios.put('/team/logo', { logo: reader.result, teamID }).then(res => {
      dispatch({ type: actionTypes.CHANGE_TEAM_LOGO, logo: res.data.logoURL, teamID });
    }).catch(err => errHandler());
  };
  reader.onerror = () => errHandler();
};

export const removeTeamLogo = teamID => async dispatch => {
  try {
    await axios.delete('/team/logo/' + teamID);
    dispatch({ type: actionTypes.REMOVE_TEAM_LOGO, teamID });
  } catch (err) {
    dispatch(addNotif('There was an error while removing the logo.'));
  }
};

export const deleteTeam = push => async (dispatch, getState) => {
  try {
    const teamID = getState().team.teamID;
    await axios.delete('/team/' + teamID);
    dispatch({ type: actionTypes.DELETE_TEAM, teamID });
    push('/');
  } catch (err) {
    dispatch(addNotif('There was an error while deleting your team.'));
  }
};
