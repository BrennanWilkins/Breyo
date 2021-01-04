import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';

const loginDispatch = payload => ({ type: actionTypes.LOGIN, payload });

export const loginErr = msg => ({ type: actionTypes.LOGIN_ERR, msg });

export const signupErr = msg => ({ type: actionTypes.SIGNUP_ERR, msg });

export const authReset = () => ({ type: actionTypes.AUTH_RESET });

export const getUserData = () => async dispatch => {
  try {
    const res = await axios.get('/user');
    dispatch({ type: actionTypes.UPDATE_USER_DATA, ...res.data });
  } catch (err) {
    dispatch(addNotif('There was an error while retrieving your data.'));
  }
};

export const login = (email, password) => async dispatch => {
  try {
    dispatch({ type: actionTypes.LOGIN_LOADING });
    const res = await axios.post('/auth/login', { email, password });
    dispatch(authSuccess(res.data));
  } catch (err) {
    let msg = err.response ? err.response.data.msg :
    'There was an error connecting to the server.';
    dispatch(loginErr(msg));
  }
};

export const signup = payload => async dispatch => {
  try {
    dispatch({ type: actionTypes.SIGNUP_LOADING });
    const res = await axios.post('/auth/signup', { ...payload });
    dispatch(authSuccess(res.data));
  } catch(err) {
    let msg = err.response ? err.response.data.msg :
    'There was an error connecting to the server.';
    dispatch(signupErr(msg));
  }
};

export const authSuccess = data => dispatch => {
  axios.defaults.headers.common['x-auth-token'] = data.token;
  localStorage['token'] = data.token;
  dispatch(loginDispatch(data));
};

export const logout = () => dispatch => {
  // delete all local storage items & remove token from instance header on logout
  delete axios.defaults.headers.common['x-auth-token'];
  localStorage.removeItem('token');
  dispatch({ type: actionTypes.LOGOUT });
};

export const autoLogin = () => async dispatch => {
  if (!localStorage['token']) { return; }
  try {
    dispatch({ type: actionTypes.AUTO_LOGIN_LOADING, bool: true });
    axios.defaults.headers.common['x-auth-token'] = localStorage['token'];
    const res = await axios.post('/auth/autoLogin');
    dispatch(loginDispatch(res.data));
    dispatch({ type: actionTypes.AUTO_LOGIN_LOADING, bool: false });
  } catch (err) { dispatch(logout()); }
};

export const deleteAccount = pass => async dispatch => {
  try {
    await axios.delete(`/user/deleteAccount/${pass}`);
    dispatch(logout());
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return dispatch(addNotif('Incorrect password.'));
    }
    dispatch(addNotif('There was an error while deleting your account.'));
  }
};

export const changeAvatar = url => ({ type: actionTypes.CHANGE_AVATAR, url });

export const deleteAvatar = () => ({ type: actionTypes.DELETE_AVATAR });
