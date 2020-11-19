import * as actionTypes from './actionTypes';
import { instance as axios } from '../../axios';
import { addNotif } from './notifications';
import { sendUpdate } from './socket';
import store from '../../store';

export const addRecentActivity = newActivity => {
  store.dispatch({ type: actionTypes.ADD_RECENT_ACTIVITY, newActivity });
  sendUpdate('post/activity', JSON.stringify({ newActivity }));
};

export const getRecentCardActivity = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: true });
    const state = getState();
    const boardID = state.board.boardID;
    const cardID = state.lists.shownCardID;
    const res = await axios.get(`/activity/recent/card/${boardID}/${cardID}`);
    dispatch({ type: actionTypes.UPDATE_CARD_ACTIVITY, activity: res.data.activity });
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: false });
  } catch (err) {
    console.log(err);
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: false });
  }
};

export const getAllCardActivity = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: true });
    const state = getState();
    const boardID = state.board.boardID;
    const cardID = state.lists.shownCardID;
    const res = await axios.get(`/activity/all/card/${boardID}/${cardID}`);
    dispatch({ type: actionTypes.SET_ALL_CARD_ACTIVITY, activity: res.data.activity });
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: false });
  } catch (err) {
    console.log(err);
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: false });
  }
};

export const updateBoardActivity = activity => ({ type: actionTypes.UPDATE_BOARD_ACTIVITY, activity });

export const resetCardActivity = () => ({ type: actionTypes.RESET_CARD_ACTIVITY });

export const setShownMemberActivity = member => ({ type: actionTypes.SET_SHOWN_MEMBER_ACTIVITY, member });

export const deleteBoardActivity = () => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    await axios.delete(`/activity/${boardID}`);
    dispatch({ type: actionTypes.DELETE_BOARD_ACTIVITY, boardID });
  } catch (err) {
    dispatch(addNotif('There was an error while deleting the board\'s activity history.'));
  }
};
