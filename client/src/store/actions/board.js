import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';
import { sendUpdate } from './socket';

export const createBoard = (title, color) => async dispatch => {
  try {
    const res = await axios.post('/board', { title, color });
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    localStorage['token'] = res.data.token;
    dispatch({ type: actionTypes.CREATE_BOARD, payload: res.data.board });
  } catch (err) {
    let msg = err.response && err.response.data.msg ? err.response.data.msg : 'Your board could not be created.';
    dispatch(addNotif(msg));
  }
};

export const toggleIsStarred = (id, isActive) => async dispatch => {
  try {
    dispatch({ type: actionTypes.TOGGLE_IS_STARRED, id });
    if (isActive) { dispatch({ type: actionTypes.TOGGLE_IS_STARRED_ACTIVE }); }
    await axios.put('/board/starred', { boardID: id });
  } catch (err) {
    console.log(err);
  }
};

export const updateActiveBoard = payload => (dispatch, getState) => {
  const activeBoard = getState().auth.boards.find(board => board.boardID === payload._id);
  const isStarred = activeBoard.isStarred;
  const creatorFullName = payload.members.find(member => member.email === payload.creatorEmail).fullName;
  const userIsAdmin = activeBoard.isAdmin;
  dispatch({ type: actionTypes.UPDATE_ACTIVE_BOARD, payload, isStarred, creatorFullName, userIsAdmin });
};

export const updateBoardTitle = (title, id) => async dispatch => {
  try {
    await axios.put('/board/title', { boardID: id, title });
    sendUpdate('put/board/title', title);
    dispatch({ type: actionTypes.UPDATE_BOARD_TITLE, title });
  } catch (err) {
    console.log(err);
  }
};

export const sendInvite = (email, boardID) => async dispatch => {
  try {
    await axios.post('/board/invites', { email, boardID });
  } catch (err) {
    let msg = err.response && err.response.data.msg ? err.response.data.msg : 'There was an error while sending your invite.';
    dispatch(addNotif(msg));
  }
}

export const addAdmin = (email, boardID) => async dispatch => {
  try {
    await axios.put('/board/admins/add', { email, boardID });
    dispatch({ type: actionTypes.ADD_ADMIN, email, boardID });
    sendUpdate('put/board/admins/add', email);
  } catch (err) {
    console.log(err);
    dispatch(addNotif('There was an error while changing user permissions.'));
  }
};

export const removeAdmin = (email, boardID) => async dispatch => {
  try {
    await axios.put('/board/admins/remove', { email, boardID });
    dispatch({ type: actionTypes.REMOVE_ADMIN, email, boardID });
    sendUpdate('put/board/admins/remove', email);
  } catch (err) {
    dispatch(addNotif('There was an error while changing user permissions.'));
  }
};

export const demoteSelf = boardID => ({ type: actionTypes.DEMOTE_SELF, boardID });

export const updateColor = (color, boardID) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    dispatch({ type: actionTypes.UPDATE_COLOR, color });
    await axios.put('/board/color', { color, boardID });
    sendUpdate('put/board/color', color);
  } catch (err) {
    console.log(err);
  }
};

export const updateBoardDesc = desc => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    dispatch({ type: actionTypes.UPDATE_BOARD_DESC, desc });
    await axios.put('/board/desc', { desc, boardID });
    sendUpdate('put/board/desc', desc);
  } catch (err) { console.log(err); }
};

export const deleteBoard = () => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    await axios.delete('/board/' + boardID);
    dispatch({ type: actionTypes.DELETE_BOARD, boardID });
  } catch (err) {
    dispatch(addNotif('There was an error while deleting the board.'));
  }
};

export const acceptInvite = boardID => async dispatch => {
  try {
    const tokenRes = await axios.put('/board/invites/accept', { boardID });
    axios.defaults.headers.common['x-auth-token'] = tokenRes.data.token;
    localStorage['token'] = tokenRes.data.token;

    const res = await axios.get('/auth/userData');

    dispatch({ type: actionTypes.UPDATE_USER_DATA, invites: res.data.invites, boards: res.data.boards });
    dispatch({ type: actionTypes.REMOVE_INVITE, boardID });
  } catch (err) {
    dispatch(addNotif('There was an error while joining the board.'));
  }
};

export const rejectInvite = boardID => async dispatch => {
  try {
    dispatch({ type: actionTypes.REMOVE_INVITE, boardID });
    await axios.put('/board/invites/reject', { boardID });
  } catch (err) {
    console.log(err);
  }
};

export const leaveBoard = () => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    await axios.put('/board/leave', { boardID });
    dispatch({ type: actionTypes.LEAVE_BOARD, boardID });
  } catch (err) {
    dispatch(addNotif('There was an error while leaving the board.'));
  }
};
