import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';

export const createBoard = (title, color) => async dispatch => {
  try {
    const res = await axios.post('/board', { title, color });
    dispatch({ type: actionTypes.CREATE_BOARD, payload: res.data });
  } catch (err) {
    let msg = err.response && err.response.data.msg ? err.response.data.msg : 'Your board could not be created.';
    dispatch(addNotif(msg));
  }
};

export const toggleIsStarred = id => async dispatch => {
  try {
    dispatch({ type: actionTypes.TOGGLE_IS_STARRED, id });
    await axios.put('/board/starred', { boardID: id });
  } catch (err) {
    console.log(err);
  }
};

export const updateActiveBoard = payload => (dispatch, getState) => {
  const refreshEnabled = getState().auth.boards.find(board => board.boardID === payload._id).refreshEnabled;
  dispatch({ type: actionTypes.UPDATE_ACTIVE_BOARD, payload, refreshEnabled });
};

export const updateBoardTitle = (title, id) => async dispatch => {
  try {
    await axios.put('/board/title', { boardID: id, title });
    dispatch({ type: actionTypes.UPDATE_BOARD_TITLE, title });
  } catch (err) {
    console.log(err);
  }
};

export const sendInvite = (email, boardID) => async dispatch => {
  try {
    await axios.put('/board/invites/send', { email, boardID });
  } catch (err) {
    let msg = err.response && err.response.data.msg ? err.response.data.msg : 'There was an error while sending your invite.';
    dispatch(addNotif(msg));
  }
}

export const addAdmin = (email, boardID) => async dispatch => {
  try {
    await axios.put('/board/admin/add', { email, boardID });
    dispatch({ type: actionTypes.ADD_ADMIN, email, boardID });
  } catch (err) {
    dispatch(addNotif('There was an error while changing user permissions'));
  }
};

export const removeAdmin = (email, boardID) => async dispatch => {
  try {
    await axios.put('/board/admin/remove', { email, boardID });
    dispatch({ type: actionTypes.REMOVE_ADMIN, email, boardID });
  } catch (err) {
    dispatch(addNotif('There was an error while changing user permissions'));
  }
};

export const demoteSelf = boardID => ({ type: actionTypes.DEMOTE_SELF, boardID });

export const updateColor = (color, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.UPDATE_COLOR, color });
    await axios.put('/board/color', { color, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const updateBoardDesc = (desc, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.UPDATE_BOARD_DESC, desc });
    await axios.put('/board/desc', { desc, boardID });
  } catch (err) { console.log(err); }
};

export const updateRefreshEnabled = boardID => async dispatch => {
  try {
    dispatch({ type: actionTypes.UPDATE_REFRESH_ENABLED, boardID });
    await axios.put('/board/refreshEnabled', { boardID });
  } catch (err) { console.log(err); }
};

export const deleteBoard = boardID => async dispatch => {
  try {
    await axios.delete('/board/' + boardID);
    dispatch({ type: actionTypes.DELETE_BOARD, boardID });
  } catch (err) {
    dispatch(addNotif('There was an error while deleting the board.'));
  }
}
