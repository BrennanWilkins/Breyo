import * as actionTypes from './actionTypes';
import { nanoid } from 'nanoid';

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
  const newNotif = { id: nanoid(), msg: notif };
  const notifs = [...getState().notifications.notifs, newNotif];
  dispatch(setNotifs(notifs));
  dispatch(removeNotif(newNotif.id));
};

export const serverErr = () => dispatch => {
  dispatch(addNotif('There was an error while connecting to the server. Your changes may not be saved.'));
};

export const permissionErr = err => dispatch => {
  const errMsg = err?.response?.status === 403 ? 'You must be an admin to change member permissions.' :
  (err?.response?.data?.msg || 'There was an error while demoting the team member.');
  dispatch(addNotif(errMsg));
};
