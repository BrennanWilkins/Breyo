import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';

const updateListTitleDispatch = (title, listID) => ({ type: actionTypes.UPDATE_LIST_TITLE, title, listID });

export const updateListTitle = (title, listID, boardID) => async dispatch => {
  try {
    await axios.put('/list/title', { title, listID, boardID });
    dispatch(updateListTitleDispatch(title, listID));
  } catch (err) {
    console.log(err);
  }
};

const addListDispatch = (title, listID) => ({ type: actionTypes.ADD_LIST, title, listID });

export const addList = (title, boardID) => async dispatch => {
  try {
    const res = await axios.post('/list', { title, boardID });
    dispatch(addListDispatch(title, res.data.listID));
  } catch (err) {
    dispatch(addNotif('Your list could not be created.'));
  }
};
