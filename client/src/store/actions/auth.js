import { instance as axios, setToken, removeToken } from '../../axios';
import * as actionTypes from './actionTypes';

const loginDispatch = payload => ({ type: actionTypes.LOGIN, payload });

export const loginErr = msg => ({ type: actionTypes.LOGIN_ERR, msg });

export const signupErr = msg => ({ type: actionTypes.SIGNUP_ERR, msg });

export const authReset = () => ({ type: actionTypes.AUTH_RESET });

export const login = (email, password) => async dispatch => {
  try {
    dispatch({ type: actionTypes.LOGIN_LOADING });
    const res = await axios.post('/auth', { email, password });
    dispatch(authSuccess(res.data));
  } catch (err) {
    const msg = err?.response?.data?.msg || 'There was an error connecting to the server.';
    dispatch(loginErr(msg));
  }
};

export const signup = payload => async dispatch => {
  try {
    dispatch({ type: actionTypes.SIGNUP_LOADING });
    const res = await axios.post('/auth/signup', { ...payload });
    dispatch(authSuccess(res.data));
  } catch(err) {
    const msg = err?.response?.data?.msg || 'There was an error connecting to the server.';
    dispatch(signupErr(msg));
  }
};

export const authSuccess = data => dispatch => {
  setToken(data.token);
  dispatch(loginDispatch(data));
};

export const logout = () => dispatch => {
  // reset redux store & remove token from local storage/instance header on logout
  removeToken();
  dispatch({ type: actionTypes.LOGOUT });
};

export const autoLogin = () => async dispatch => {
  if (!localStorage['token']) { return; }
  try {
    dispatch({ type: actionTypes.AUTO_LOGIN_LOADING, bool: true });
    axios.defaults.headers.common['x-auth-token'] = localStorage['token'];
    const res = await axios.get('/auth');
    dispatch(loginDispatch(res.data));
    dispatch({ type: actionTypes.AUTO_LOGIN_LOADING, bool: false });
  } catch (err) { dispatch(logout()); }
};
