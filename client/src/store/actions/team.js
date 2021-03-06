import * as actionTypes from './actionTypes';
import { instance as axios, setToken } from '../../axios';
import { addNotif, serverErr, permissionErr } from './notifications';
import { sendBoardUpdate, initTeamSocket, connectTeamSocket,
  connectAndGetTeamSocket, sendTeamUpdate } from '../../socket/socket';

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
    if (!teamID) { throw 'No teamID found'; }
    const res = await axios.get('/team/' + teamID);
    const { data } = res.data;

    let userIsAdmin = state.user.teams.byID[teamID].isAdmin;
    if (data.token) {
      setToken(data.token);
      dispatch({ type: actionTypes.UPDATE_USER_TEAMS, teams: data.teams, adminTeams: data.adminTeams });
      userIsAdmin = data.adminTeams.includes(teamID);
    }

    data.team.userIsAdmin = userIsAdmin;
    dispatch({ type: actionTypes.SET_ACTIVE_TEAM, team: data.team });

    // initalize new socket connection on new team page load
    initTeamSocket(teamID);
    connectTeamSocket();
  } catch (err) {
    push('/');
    dispatch(addNotif('There was an error while loading the team page.'));
  }
};

export const editTeam = payload => dispatch => {
  dispatch({ type: actionTypes.EDIT_TEAM, payload });
  sendTeamUpdate('put/team/info', { payload });
};

export const changeTeamLogo = (img, teamID) => async dispatch => {
  const errHandler = msg => dispatch(addNotif(msg));
  const reader = new FileReader();
  reader.readAsDataURL(img);

  reader.onloadend = () => {
    axios.put(`/team/logo/${teamID}`, { logo: reader.result }).then(res => {
      const payload = { logo: res.data.logoURL, teamID };
      dispatch({ type: actionTypes.CHANGE_TEAM_LOGO, ...payload });
      sendTeamUpdate('put/team/logo', payload);
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
    sendTeamUpdate('delete/team/logo', { teamID });
  } catch (err) {
    dispatch(addNotif('There was an error while removing the logo.'));
  }
};

export const deleteTeam = push => async (dispatch, getState) => {
  try {
    const teamID = getState().team.teamID;
    await axios.delete('/team/' + teamID);
    dispatch({ type: actionTypes.DELETE_TEAM, teamID });
    sendTeamUpdate('delete/team', { teamID });
    push('/');
  } catch (err) {
    dispatch(addNotif(err?.response?.status === 403 ? 'You must be an admin of the team to delete it.' :
    'There was an error while deleting your team.'));
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

export const acceptTeamInvite = (teamID, push) => async (dispatch, getState) => {
  try {
    const res = await axios.put(`/team/invites/${teamID}`);
    const { token, team } = res.data;
    team.isAdmin = false;
    const state = getState();
    const { email, fullName, avatar } = state.user;
    const member = { email, fullName, avatar, isAdmin: false };
    setToken(token);

    dispatch({ type: actionTypes.JOIN_TEAM, team });
    // manually connect socket and once joined send update to other members
    initTeamSocket(teamID);
    const socket = connectAndGetTeamSocket();
    socket.on('joined', () => {
      // remove listener once joined
      socket.off('joined');
      sendTeamUpdate('post/team/newMember', { member });
    });
    // automatically send user to the board
    push(`/team/${team.url}`);
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
    const state = getState();
    const teamID = state.team.teamID;
    const email = state.user.email;
    const res = await axios.put('/team/leave', { teamID });
    setToken(res.data.token);
    sendTeamUpdate('put/team/memberLeft', { email });
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
    dispatch({ type: actionTypes.CHANGE_BOARD_TEAM, team, boardID });
    sendBoardUpdate('put/board/changeTeam', { team, boardID });
  } catch (err) {
    const errMsg = err?.response?.status === 403 ? 'You must be an admin of this board to change its team' :
    (err?.response?.data?.msg || 'There was an error while moving the board.');
    dispatch(addNotif(errMsg));
  }
};

export const addToTeam = teamID => async (dispatch, getState) => {
  try {
    const state = getState();
    const boardID = state.board.boardID;
    const team = state.user.teams.byID[teamID];
    await axios.put('/board/addToTeam', { boardID, teamID });
    dispatch({ type: actionTypes.CHANGE_BOARD_TEAM, team, boardID });
    sendBoardUpdate('put/board/changeTeam', { team, boardID });
  } catch (err) {
    const errMsg = err?.response?.status === 403 ? 'You must be an admin of this board to add it to a team.' :
    'There was an error while adding the board to the team.';
    dispatch(addNotif(errMsg));
  }
};

export const removeBoardFromTeam = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const boardID = state.board.boardID;
    const teamID = state.board.team.teamID;
    await axios.put(`/board/removeFromTeam/${teamID}`, { boardID });
    dispatch({ type: actionTypes.REMOVE_BOARD_FROM_TEAM, boardID });
    sendBoardUpdate('put/board/removeFromTeam', { boardID });
  } catch (err) {
    const errMsg = err?.response?.status === 403 ? 'You must be an admin of both the board and its team to remove it from its team.' :
    (err?.response?.data?.msg || 'There was an error while removing the board from its team.');
    dispatch(addNotif(errMsg));
  }
};

export const promoteTeamMember = email => async (dispatch, getState) => {
  try {
    const state = getState();
    const teamID = state.team.teamID;
    await axios.post(`/team/admins/${teamID}`, { email });
    dispatch({ type: actionTypes.PROMOTE_TEAM_MEMBER, teamID, email });
    sendTeamUpdate('post/team/admins', email);
  } catch (err) {
    dispatch(permissionErr(err));
  }
};

export const demoteTeamMember = email => async (dispatch, getState) => {
  try {
    const state = getState();
    const teamID = state.team.teamID;
    const userEmail = state.user.email;
    await axios.delete(`/team/admins/${teamID}/${email}`);
    if (userEmail === email) {
      const res = await axios.get('/auth/newToken');
      setToken(res.data.token);
      dispatch({ type: actionTypes.DEMOTE_SELF_TEAM_MEMBER, teamID });
    }
    dispatch({ type: actionTypes.DEMOTE_TEAM_MEMBER, teamID, email });
    sendTeamUpdate('delete/team/admins', email);
  } catch (err) {
    dispatch(permissionErr(err));
  }
};
