import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif, serverErr } from './notifications';
import { sendUpdate } from './socket';
import { addRecentActivity, addRecentActivities } from './activity';

export const updateListTitle = (title, listID) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const payload = { title, listID, boardID };
    dispatch({ type: actionTypes.UPDATE_LIST_TITLE, ...payload });
    const res = await axios.put('/list/title', payload);
    sendUpdate('put/list/title', payload);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const addList = title => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const res = await axios.post('/list', { title, boardID });
    const payload = { title, listID: res.data.listID };
    dispatch({ type: actionTypes.ADD_LIST, ...payload });
    sendUpdate('post/list', payload);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(addNotif('Your list could not be created.'));
  }
};

export const copyList = (title, listID) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const res = await axios.post('/list/copy', { title, listID, boardID });
    const { newList } = res.data;
    dispatch({ type: actionTypes.COPY_LIST, newList });
    sendUpdate('post/list/copy', { newList });
    addRecentActivities(res.data.activities);
  } catch (err) {
    dispatch(addNotif('There was an error while copying the list.'));
  }
};

export const archiveList = listID => async (dispatch, getState) => {
  try {
    const state = getState();
    const boardID = state.board.boardID;
    const userIsAdmin = state.board.userIsAdmin;
    if (!userIsAdmin) { return dispatch(addNotif('You must be an admin to archive lists.')); }
    dispatch({ type: actionTypes.ARCHIVE_LIST, listID });
    const res = await axios.post('/list/archive', { listID, boardID }).catch(err => {
      // if server error while archiving list then undo archive
      dispatch({ type: actionTypes.UNDO_ARCHIVE_LIST, listID });
      throw err;
    });
    sendUpdate('post/list/archive', { listID });
    addRecentActivity(res.data.newActivity);
  } catch(err) {
    dispatch(serverErr());
  }
};

export const recoverList = (listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.RECOVER_LIST, listID });
    const res = await axios.put('/list/archive/recover', { listID, boardID }).catch(err => {
      // if server error while recovering list then archive it again
      dispatch({ type: actionTypes.ARCHIVE_LIST, listID });
      throw err;
    });
    sendUpdate('put/list/archive/recover', { listID });
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const deleteList = (listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.DELETE_LIST, listID });
    const res = await axios.delete(`/list/archive/${listID}/${boardID}`);
    const { activity } = res.data;
    dispatch({ type: actionTypes.UPDATE_BOARD_ACTIVITY_DELETE_LIST, activity });
    sendUpdate('delete/list/archive', { listID });
    sendUpdate('put/activity/board/deleteList', { activity, listID });
  } catch(err) {
    dispatch(serverErr());
  }
};

export const archiveAllCards = listID => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const res = await axios.put('/list/archive/allCards', { listID, boardID });
    dispatch({ type: actionTypes.ARCHIVE_ALL_CARDS, listID });
    sendUpdate('put/list/archive/allCards', { listID });
    addRecentActivities(res.data.activities);
  } catch(err) {
    dispatch(serverErr());
  }
};

export const moveAllCards = (oldListID, newListID) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const payload = { oldListID, newListID, boardID };
    await axios.put('/list/moveAllCards', payload);
    dispatch({ type: actionTypes.MOVE_ALL_CARDS, ...payload });
    sendUpdate('put/list/moveAllCards', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const toggleVoting = listID => async (dispatch, getState) => {
  try {
    const state = getState();
    if (!state.board.userIsAdmin) { return dispatch(addNotif('You must be an admin to start or close voting on a list.')); }
    const payload = { listID, boardID: state.board.boardID };
    const res = await axios.post('/list/voting', payload);
    dispatch({ type: actionTypes.TOGGLE_LIST_VOTING, ...payload });
    addRecentActivity(res.data.newActivity);
    sendUpdate('post/list/voting', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const setListLimit = (listID, limit) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const payload = { boardID, listID, limit };
    const res = await axios.put('/list/limit', payload);
    dispatch({ type: actionTypes.SET_LIST_LIMIT, ...payload });
    addRecentActivity(res.data.newActivity);
    sendUpdate('put/list/limit', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const removeListLimit = listID => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const res = await axios.delete(`/list/limit/${boardID}/${listID}`);
    dispatch({ type: actionTypes.REMOVE_LIST_LIMIT, listID });
    addRecentActivity(res.data.newActivity);
    sendUpdate('delete/list/limit', { listID });
  } catch (err) {
    dispatch(serverErr());
  }
};

export const sortList = (listID, mode) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const payload = { listID, boardID, mode };
    const res = await axios.put('/list/sort', payload);
    payload.cards = res.data.cards;
    dispatch({ type: actionTypes.SORT_LIST, ...payload });
    sendUpdate('put/list/sort', payload);
  } catch (err) {
    dispatch(addNotif('There was an error while sorting the list.'));
  }
};
