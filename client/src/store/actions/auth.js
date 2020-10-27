import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';

export const loginDispatch = payload => ({ type: actionTypes.LOGIN, payload });

export const logoutDispatch = () => ({ type: actionTypes.LOGOUT });

export const loginErr = msg => ({ type: actionTypes.LOGIN_ERR, msg });

export const signupErr = msg => ({ type: actionTypes.SIGNUP_ERR, msg });

export const loginLoading = () => ({ type: actionTypes.LOGIN_LOADING });

export const signupLoading = () => ({ type: actionTypes.SIGNUP_LOADING });

export const authReset = () => ({ type: actionTypes.AUTH_RESET });

export const login = (email, password) => async dispatch => {
  try {
    dispatch(loginLoading());
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
    dispatch(signupLoading());
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
  dispatch(logoutDispatch());
};

export const autoLogin = () => async dispatch => {
  if (!localStorage['token']) { return; }
  try {
    axios.defaults.headers.common['x-auth-token'] = localStorage['token'];
    const res = await axios.post('/auth/autoLogin');
    dispatch(loginDispatch(res.data));
  } catch (err) { dispatch(logout()); }
}
