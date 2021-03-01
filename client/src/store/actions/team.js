import * as actionTypes from './actionTypes';
import { instance as axios, setToken } from '../../axios';
import { addNotif, serverErr } from './notifications';
import { sendUpdate } from './socket';

export const createTeam = payload => dispatch => {
  const { title, teamID, url, token, push } = payload;
  const team = { title, teamID, url, boards: [], isAdmin: true };
  setToken(token);
  dispatch({ type: actionTypes.CREATE_TEAM, team });
  push('/team/' + url);
};

export const getActiveTeam = (url, push) => async (dispatch, getState) => {
  try {
    const state = getState();
    const teamID = state.user.teams.allIDs.find(teamID => state.user.teams.byID[teamID].url === url);
    const isAdmin = state.user.teams.byID[teamID].isAdmin;
    const res = await axios.get('/team/' + teamID);
    const { data } = res.data;
    data.team.userIsAdmin = isAdmin;

    if (data.token) {
      setToken(data.token);
      dispatch({ type: actionTypes.UPDATE_USER_TEAMS, teams: data.teams, adminTeams: data.adminTeams });
    }

    dispatch({ type: actionTypes.SET_ACTIVE_TEAM, team: data.team });
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
    axios.put(`/team/logo/${teamID}`, { logo: reader.result }).then(res => {
      dispatch({ type: actionTypes.CHANGE_TEAM_LOGO, logo: res.data.logoURL, teamID });
    }).catch(err => {
      if (err?.response?.status === 413) { return errHandler('That image is too large to upload.'); }
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

export const inviteTeamMembers = emails => async (dispatch, getState) => {
  try {
    const teamID = getState().team.teamID;
    await axios.post('/team/invites', { emails, teamID });
  } catch (err) {
    const errMsg = err?.response?.data?.msg || 'There was an error while inviting users to the team.';
    dispatch(addNotif(errMsg));
  }
};

export const acceptTeamInvite = (teamID, push) => async dispatch => {
  try {
    const res = await axios.put(`/team/invites/${teamID}`);
    const { token, team } = res.data;
    setToken(token);
    team.isAdmin = false;
    dispatch({ type: actionTypes.JOIN_TEAM, team });
    push('/team/' + team.url);
  } catch (err) {
    const errMsg = err?.response?.data?.msg || 'There was an error while joining the team.';
    dispatch(addNotif(errMsg));
  }
};

export const rejectTeamInvite = teamID => async dispatch => {
  try {
    dispatch({ type: actionTypes.REJECT_TEAM_INVITE, teamID });
    await axios.delete(`/team/invites/${teamID}`);
  } catch (err) { dispatch(serverErr()); }
};

export const leaveTeam = push => async (dispatch, getState) => {
  try {
    const teamID = getState().team.teamID;
    const res = await axios.put(`/team/leave/${teamID}`);
    setToken(res.data.token);
    push('/');
  } catch (err) {
    const errMsg = err?.response?.data?.msg || 'There was an error while leaving the team.';
    dispatch(addNotif(errMsg));
  }
};

export const changeBoardTeam = (oldTeamID, newTeamID) => async (dispatch, getState) => {
  try {
    const state = getState();
    const boardID = state.board.boardID;
    await axios.put('/board/changeTeam', { boardID, teamID: oldTeamID, newTeamID });
    const team = state.user.teams.byID[newTeamID];
    dispatch({ type: actionTypes.CHANGE_BOARD_TEAM, team });
    sendUpdate('put/board/changeTeam', { team });
  } catch (err) {
    dispatch(addNotif('There was an error while moving the board.'));
  }
};

export const addToTeam = teamID => async (dispatch, getState) => {
  try {
    const state = getState();
    const boardID = state.board.boardID;
    const team = state.user.teams.byID[teamID];
    await axios.put('/board/addToTeam', { boardID, teamID });
    dispatch({ type: actionTypes.CHANGE_BOARD_TEAM, team });
    sendUpdate('put/board/changeTeam', { team });
  } catch (err) {
    dispatch(addNotif('There was an error while adding the board to the team.'));
  }
};

export const promoteTeamMember = email => async (dispatch, getState) => {
  try {
    const state = getState();
    const teamID = state.team.teamID;
    await axios.post(`/team/admins/${teamID}`, { email });
    dispatch({ type: actionTypes.PROMOTE_TEAM_MEMBER, teamID, email });
  } catch (err) {
    if (err?.response?.status === 401) { return dispatch(addNotif('You must be an admin to change member permissions.')); }
    const errMsg = err?.response?.data?.msg || 'There was an error while promoting the team member.';
    dispatch(addNotif(errMsg));
  }
};

export const demoteTeamMember = email => async (dispatch, getState) => {
  try {
    const state = getState();
    const teamID = state.team.teamID;
    const userEmail = state.user.email;
    await axios.delete(`/team/admins/${teamID}/${email}`);
    if (userEmail === email) {
      dispatch({ type: actionTypes.DEMOTE_SELF_TEAM_MEMBER, teamID });
    }
    dispatch({ type: actionTypes.DEMOTE_TEAM_MEMBER, teamID, email });
  } catch (err) {
    if (err?.response?.status === 401) { return dispatch(addNotif('You must be an admin to change member permissions.')); }
    const errMsg = err?.response?.data?.msg || 'There was an error while demoting the team member.';
    dispatch(addNotif(errMsg));
  }
};
