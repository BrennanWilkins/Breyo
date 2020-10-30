import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';

const createBoardDispatch = payload => ({ type: actionTypes.CREATE_BOARD, payload });

const toggleIsStarredDispatch = id => ({ type: actionTypes.TOGGLE_IS_STARRED, id });

export const createBoard = (title, color) => async dispatch => {
  try {
    const res = await axios.post('/board', { title, color });
    dispatch(createBoardDispatch(res.data));
  } catch (err) {
    let msg = err.response && err.response.data.msg ? err.response.data.msg : 'Your board could not be created.';
    dispatch(addNotif(msg));
  }
};

export const toggleIsStarred = id => async dispatch => {
  try {
    dispatch(toggleIsStarredDispatch(id));
    await axios.put('/board/starred', { boardID: id });
  } catch (err) {
    console.log(err);
  }
};

export const updateActiveBoard = payload => ({ type: actionTypes.UPDATE_ACTIVE_BOARD, payload });

const updateTitleDispatch = title => ({ type: actionTypes.UPDATE_BOARD_TITLE, title });

export const updateBoardTitle = (title, id) => async dispatch => {
  try {
    await axios.put('/board/title', { boardID: id, title });
    dispatch(updateTitleDispatch(title));
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

const addAdminDispatch = (email, boardID) => ({ type: actionTypes.ADD_ADMIN, email, boardID });

const removeAdminDispatch = (email, boardID) => ({ type: actionTypes.REMOVE_ADMIN, email, boardID });

export const addAdmin = (email, boardID) => async dispatch => {
  try {
    await axios.put('/board/admin/add', { email, boardID });
    dispatch(addAdminDispatch(email, boardID));
  } catch (err) {
    dispatch(addNotif('There was an error while changing user permissions'));
  }
};

export const removeAdmin = (email, boardID) => async dispatch => {
  try {
    await axios.put('/board/admin/remove', { email, boardID });
    dispatch(removeAdminDispatch(email, boardID));
  } catch (err) {
    dispatch(addNotif('There was an error while changing user permissions'));
  }
};

export const demoteSelf = boardID => ({ type: actionTypes.DEMOTE_SELF, boardID });

const updateColorDispatch = color => ({ type: actionTypes.UPDATE_COLOR, color });

export const updateColor = (color, boardID) => async dispatch => {
  try {
    dispatch(updateColorDispatch(color));
    await axios.put('/board/color', { color, boardID });
  } catch (err) {
    console.log(err);
  }
};

const updateBoardDescDispatch = desc => ({ type: actionTypes.UPDATE_BOARD_DESC, desc });

export const updateBoardDesc = (desc, boardID) => async dispatch => {
  try {
    dispatch(updateBoardDescDispatch(desc));
    await axios.put('/board/desc', { desc, boardID });
  } catch (err) { console.log(err); }
};
