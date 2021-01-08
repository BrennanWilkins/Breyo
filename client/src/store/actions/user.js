import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';
import { logout } from './auth';

export const getUserData = () => async dispatch => {
  try {
    const res = await axios.get('/user');
    dispatch({ type: actionTypes.UPDATE_USER_DATA, ...res.data });
  } catch (err) {
    dispatch(addNotif('There was an error while retrieving your data.'));
  }
};

export const deleteAccount = pass => async dispatch => {
  try {
    await axios.delete(`/user/deleteAccount/${pass}`);
    dispatch(logout());
  } catch (err) {
    if (err?.response?.status === 400) { return dispatch(addNotif('Incorrect password.')); }
    dispatch(addNotif('There was an error while deleting your account.'));
  }
};

export const changeAvatar = url => ({ type: actionTypes.CHANGE_AVATAR, url });

export const deleteAvatar = () => ({ type: actionTypes.DELETE_AVATAR });
