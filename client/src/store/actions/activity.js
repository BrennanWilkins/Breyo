import * as actionTypes from './actionTypes';
import { instance as axios } from '../../axios';

export const getRecentCardActivity = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: true });
    const state = getState();
    const boardID = state.board.boardID;
    const cardID = state.lists.shownCardID;
    const res = await axios.get(`/activity/recent/${boardID}/${cardID}`);
    dispatch({ type: actionTypes.UPDATE_CARD_ACTIVITY, activity: res.data.activity });
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: false });
  } catch (err) {
    console.log(err);
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: false });
  }
};

export const updateBoardActivity = activity => ({ type: actionTypes.UPDATE_BOARD_ACTIVITY, activity });

export const resetCardActivity = () => ({ type: actionTypes.RESET_CARD_ACTIVITY });
