import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';
import { sendUpdate } from './socket';

export const updateListTitle = (title, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.UPDATE_LIST_TITLE, title, listID });
    await axios.put('/list/title', { title, listID, boardID });
    sendUpdate('put/list/title', JSON.stringify({ title, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const addList = (title, boardID) => async dispatch => {
  try {
    const res = await axios.post('/list', { title, boardID });
    dispatch({ type: actionTypes.ADD_LIST, title, listID: res.data.listID });
    sendUpdate('post/list', JSON.stringify({ title, listID: res.data.listID }));
  } catch (err) {
    dispatch(addNotif('Your list could not be created.'));
  }
};

export const copyList = (title, listID, boardID) => async dispatch => {
  try {
    const res = await axios.post('/list/copy', { title, listID, boardID });
    dispatch({ type: actionTypes.COPY_LIST, newList: res.data.newList });
    sendUpdate('post/list/copy', JSON.stringify({ newList: res.data.newList }));
  } catch (err) {
    dispatch(addNotif('There was an error while copying the list.'));
  }
};

export const archiveList = (listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.ARCHIVE_LIST, listID });
    await axios.post('/list/archive', { listID, boardID });
    sendUpdate('post/list/archive', JSON.stringify({ listID }));
  } catch(err) {
    console.log(err);
  }
};

export const recoverList = (listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.RECOVER_LIST, listID });
    const res = await axios.put('/list/archive/recover', { listID, boardID });
    dispatch({ type: actionTypes.RESTORE_ARCHIVED_CARDS, archivedCards: res.data.archivedCards, listID });
    sendUpdate('put/list/archive/recover', JSON.stringify({ listID }));
    sendUpdate('put/card/archive/restore', JSON.stringify({ archivedCards: res.data.archivedCards, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const deleteList = (listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.DELETE_LIST, listID });
    await axios.put('/list/archive/delete', { listID, boardID });
    sendUpdate('put/list/archive/delete', JSON.stringify({ listID }));
  } catch(err) {
    console.log(err);
  }
};

export const archiveAllCards = (listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.ARCHIVE_ALL_CARDS, listID });
    await axios.put('/list/archive/allCards', { listID, boardID });
    sendUpdate('put/list/archive/allCards', JSON.stringify({ listID }));
  } catch(err) {
    console.log(err);
  }
};

export const moveAllCards = (oldListID, newListID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.MOVE_ALL_CARDS, oldListID, newListID });
    await axios.put('/list/moveAllCards', { oldListID, newListID, boardID });
    sendUpdate('put/list/moveAllCards', JSON.stringify({ oldListID, newListID }));
  } catch (err) {
    console.log(err);
  }
};
