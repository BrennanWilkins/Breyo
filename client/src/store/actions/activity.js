import * as actionTypes from './actionTypes';
import { instance as axios } from '../../axios';
import { addNotif } from './notifications';
import { sendUpdate } from './socket';
import store from '../../store';

export const addRecentActivity = newActivity => {
  store.dispatch({ type: actionTypes.ADD_RECENT_ACTIVITY, newActivity });
  sendUpdate('post/activity', { newActivity });
};

export const addRecentActivities = activities => {
  for (let newActivity of activities) {
    store.dispatch({ type: actionTypes.ADD_RECENT_ACTIVITY, newActivity });
    sendUpdate('post/activity', { newActivity });
  }
};

export const getRecentCardActivity = () => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: true });
    const state = getState();
    const boardID = state.board.boardID;
    const cardID = state.lists.shownCardID;
    const res = await axios.get(`/activity/recent/card/${boardID}/${cardID}`);
    dispatch({ type: actionTypes.SET_CARD_ACTIVITY, activity: res.data.activity, cardID });
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: false });
  } catch (err) {
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
    dispatch({ type: actionTypes.SET_CARD_ACTIVITY, activity: res.data.activity, cardID });
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: false });
  } catch (err) {
    dispatch({ type: actionTypes.CARD_ACTIVITY_LOADING, bool: false });
  }
};

export const resetCardActivity = () => ({ type: actionTypes.RESET_CARD_ACTIVITY });

export const setShownMemberActivity = member => ({ type: actionTypes.SET_SHOWN_MEMBER_ACTIVITY, member });

export const deleteBoardActivity = () => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    await axios.delete(`/activity/${boardID}`);
    dispatch({ type: actionTypes.DELETE_BOARD_ACTIVITY });
    sendUpdate('delete/activity');
  } catch (err) {
    dispatch(addNotif('There was an error while deleting the board\'s activity history.'));
  }
};

export const fetchFirstPageBoardActivity = () => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    dispatch({ type: actionTypes.SET_LOADING_ALL_BOARD_ACTIVITY, bool: true });
    const res = await axios.get(`/activity/all/board/${boardID}/firstPage`);
    dispatch({ type: actionTypes.SET_LOADING_ALL_BOARD_ACTIVITY, bool: false });
    dispatch({ type: actionTypes.SET_ALL_BOARD_ACTIVITY_FIRST_PAGE, activity: res.data.activity });
  } catch (err) {
    dispatch({ type: actionTypes.SET_LOADING_ALL_BOARD_ACTIVITY, bool: false });
    dispatch({ type: actionTypes.SET_ERR_ALL_BOARD_ACTIVITY, bool: true });
  }
};

export const fetchAllBoardActivity = () => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const res = await axios.get(`/activity/all/board/${boardID}/allActions`);
    dispatch({ type: actionTypes.SET_ALL_BOARD_ACTIVITY, activity: res.data.activity });
  } catch (err) {
    dispatch({ type: actionTypes.SET_ERR_ALL_BOARD_ACTIVITY, bool: true });
  }
};

export const resetAllBoardActivity = () => ({ type: actionTypes.RESET_ALL_BOARD_ACTIVITY });

export const setAllBoardActivityShown = () => ({ type: actionTypes.SET_ALL_BOARD_ACTIVITY_SHOWN });
