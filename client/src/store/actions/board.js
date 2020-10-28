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
    let msg = err.response ? err.response.data.msg : 'Your board could not be created.';
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
