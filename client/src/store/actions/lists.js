import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif, serverErr } from './notifications';
import { sendUpdate } from './socket';
import { addRecentActivity, addRecentActivities } from './activity';

export const updateListTitle = (title, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.UPDATE_LIST_TITLE, title, listID });
    const res = await axios.put('/list/title', { title, listID, boardID });
    sendUpdate('put/list/title', JSON.stringify({ title, listID }));
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const addList = (title, boardID) => async dispatch => {
  try {
    const res = await axios.post('/list', { title, boardID });
    dispatch({ type: actionTypes.ADD_LIST, title, listID: res.data.listID });
    sendUpdate('post/list', JSON.stringify({ title, listID: res.data.listID }));
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(addNotif('Your list could not be created.'));
  }
};

export const copyList = (title, listID, boardID) => async dispatch => {
  try {
    const res = await axios.post('/list/copy', { title, listID, boardID });
    dispatch({ type: actionTypes.COPY_LIST, newList: res.data.newList });
    sendUpdate('post/list/copy', JSON.stringify({ newList: res.data.newList }));
    addRecentActivities(res.data.activities);
  } catch (err) {
    dispatch(addNotif('There was an error while copying the list.'));
  }
};

export const archiveList = (listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.ARCHIVE_LIST, listID });
    const res = await axios.post('/list/archive', { listID, boardID }).catch(err => {
      // if server error while archiving list then undo archive
      dispatch({ type: actionTypes.UNDO_ARCHIVE_LIST, listID });
      throw err;
    });
    sendUpdate('post/list/archive', JSON.stringify({ listID }));
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
    sendUpdate('put/list/archive/recover', JSON.stringify({ listID }));
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const deleteList = (listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.DELETE_LIST, listID });
    const res = await axios.delete(`/list/archive/${listID}/${boardID}`);
    dispatch({ type: actionTypes.UPDATE_BOARD_ACTIVITY_DELETE_LIST, activity: res.data.activity });
    sendUpdate('delete/list/archive', JSON.stringify({ listID }));
    sendUpdate('put/activity/board/deleteList', JSON.stringify({ activity: res.data.activity, listID }));
  } catch(err) {
    dispatch(serverErr());
  }
};

export const archiveAllCards = (listID, boardID) => async dispatch => {
  try {
    const res = await axios.put('/list/archive/allCards', { listID, boardID });
    dispatch({ type: actionTypes.ARCHIVE_ALL_CARDS, listID });
    sendUpdate('put/list/archive/allCards', JSON.stringify({ listID }));
    addRecentActivities(res.data.activities);
  } catch(err) {
    dispatch(serverErr());
  }
};

export const moveAllCards = (oldListID, newListID, boardID) => async dispatch => {
  try {
    await axios.put('/list/moveAllCards', { oldListID, newListID, boardID });
    dispatch({ type: actionTypes.MOVE_ALL_CARDS, oldListID, newListID });
    sendUpdate('put/list/moveAllCards', JSON.stringify({ oldListID, newListID }));
  } catch (err) {
    dispatch(serverErr());
  }
};
