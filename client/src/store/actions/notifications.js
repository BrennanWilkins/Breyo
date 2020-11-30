import * as actionTypes from './actionTypes';
import { v4 as uuid } from 'uuid';

const removeNotif = id => (dispatch, getState) => {
  // delete notification after 4 sec
  setTimeout(() => {
    const notifs = getState().notifications.notifs.filter(notif => notif.id !== id);
    dispatch(setNotifs(notifs));
  }, 4000);
};

const setNotifs = notifs => ({ type: actionTypes.SET_NOTIFS, notifs });

export const deleteNotif = id => ({ type: actionTypes.DELETE_NOTIF, id });

export const addNotif = notif => (dispatch, getState) => {
  const newNotif = { id: uuid(), msg: notif };
  const notifs = [...getState().notifications.notifs, newNotif];
  dispatch(setNotifs(notifs));
  dispatch(removeNotif(newNotif.id));
};

export const serverErr = () => dispatch => {
  dispatch(addNotif('There was an error while connecting to the server. Your changes may not be saved.'));
};
