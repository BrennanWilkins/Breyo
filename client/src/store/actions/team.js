import * as actionTypes from './actionTypes';
import { instance as axios } from '../../axios';
import { addNotif, serverErr } from './notifications';
import { sendUpdate } from './socket';

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
    const teamID = getState().user.teams.find(team => team.url === url).teamID;
    const res = await axios.get('/team/' + teamID);
    dispatch({ type: actionTypes.SET_ACTIVE_TEAM, team: res.data.team });
  } catch (err) {
    push('/');
    dispatch(addNotif('There was an error while loading the team page.'));
  }
};

export const editTeam = payload => ({ type: actionTypes.EDIT_TEAM, payload });

export const changeTeamLogo = (img, teamID) => async dispatch => {
  const errHandler = msg => dispatch(addNotif(msg));
  const reader = new FileReader();
  reader.readAsDataURL(img);

  reader.onloadend = () => {
    axios.put('/team/logo', { logo: reader.result, teamID }).then(res => {
      dispatch({ type: actionTypes.CHANGE_TEAM_LOGO, logo: res.data.logoURL, teamID });
    }).catch(err => {
      if (err.response && err.response.status === 413) { return errHandler('That image is too large to upload.'); }
      errHandler('There was an error while uploading your logo.');
    });
  };
  reader.onerror = () => errHandler('There was an error while uploading your logo.');
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

export const inviteTeamMembers = members => async (dispatch, getState) => {
  try {
    const teamID = getState().team.teamID;
    await axios.post('/team/invites', { members, teamID });
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) { return dispatch(addNotif(err.response.data.msg)); }
    dispatch(addNotif('There was an error while inviting users to the team.'));
  }
};

export const acceptTeamInvite = (teamID, push) => async dispatch => {
  try {
    const res = await axios.put('/team/invites/accept', { teamID });
    const { token, team } = res.data;
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage['token'] = token;
    dispatch({ type: actionTypes.JOIN_TEAM, team });
    push('/team/' + team.url);
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) { return dispatch(addNotif(err.response.data.msg)); }
    dispatch(addNotif('There was an error while joining the team.'));
  }
};

export const rejectTeamInvite = teamID => async dispatch => {
  try {
    dispatch({ type: actionTypes.REJECT_TEAM_INVITE, teamID });
    await axios.put('/team/invites/reject', { teamID });
  } catch (err) { dispatch(serverErr()); }
};

export const leaveTeam = push => async (dispatch, getState) => {
  try {
    const teamID = getState().team.teamID;
    const res = await axios.put('/team/leave', { teamID });
    const token = res.data.token;
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage['token'] = token;
    push('/');
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) { return dispatch(addNotif(err.response.data.msg)); }
    dispatch(addNotif('There was an error while leaving the team.'));
  }
};

export const changeBoardTeam = (oldTeamID, newTeamID) => async (dispatch, getState) => {
  try {
    const state = getState();
    const boardID = state.board.boardID;
    await axios.put('/board/changeTeam', { boardID, teamID: oldTeamID, newTeamID });
    const team = state.user.teams.find(team => team.teamID === newTeamID);
    dispatch({ type: actionTypes.CHANGE_BOARD_TEAM, team });
    sendUpdate('put/board/changeTeam', JSON.stringify({ team }));
  } catch (err) {
    dispatch(addNotif('There was an error while moving the board.'));
  }
};

export const addToTeam = teamID => async (dispatch, getState) => {
  try {
    const state = getState();
    const boardID = state.board.boardID;
    const team = state.user.teams.find(team => team.teamID === teamID);
    await axios.put('/board/addToTeam', { boardID, teamID });
    dispatch({ type: actionTypes.CHANGE_BOARD_TEAM, team });
    sendUpdate('put/board/changeTeam', JSON.stringify({ team }));
  } catch (err) {
    dispatch(addNotif('There was an error while adding the board to the team.'));
  }
}
