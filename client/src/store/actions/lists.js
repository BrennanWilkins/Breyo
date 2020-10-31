import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';

const updateListTitleDispatch = (title, listID) => ({ type: actionTypes.UPDATE_LIST_TITLE, title, listID });

export const updateListTitle = (title, listID, boardID) => async dispatch => {
  try {
    await axios.put('/list/title', { title, listID, boardID });
    dispatch(updateListTitleDispatch(title, listID));
  } catch (err) {
    console.log(err);
  }
};
