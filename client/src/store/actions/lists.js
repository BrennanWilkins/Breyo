import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';

export const updateListTitle = (title, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.UPDATE_LIST_TITLE, title, listID });
    await axios.put('/list/title', { title, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const addList = (title, boardID) => async dispatch => {
  try {
    const res = await axios.post('/list', { title, boardID });
    dispatch({ type: actionTypes.ADD_LIST, title, listID: res.data.listID });
  } catch (err) {
    dispatch(addNotif('Your list could not be created.'));
  }
};

export const copyList = (title, listID, boardID) => async dispatch => {
  try {
    const res = await axios.post('/list/copy', { title, listID, boardID });
    dispatch({ type: actionTypes.COPY_LIST, newList: res.data.newList });
  } catch (err) {
    dispatch(addNotif('There was an error while copying the list.'));
  }
};

export const archiveList = (listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.ARCHIVE_LIST, listID });
    await axios.post('/list/archive', { listID, boardID });
  } catch(err) {
    console.log(err);
  }
};

export const recoverList = (listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.RECOVER_LIST, listID });
    await axios.put('/list/archive/recover', { listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const deleteList = (listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.DELETE_LIST, listID });
    await axios.put('/list/archive/delete', { listID, boardID });
  } catch(err) {
    console.log(err);
  }
};
