import axios from 'axios';
import { logout } from './store/actions';
import store from './store';

// export const baseURL = 'http://localhost:9000';
export const baseURL = 'https://breyo.herokuapp.com';

export const instance = axios.create({ baseURL: baseURL + '/api' });

export const setToken = token => {
  instance.defaults.headers.common['x-auth-token'] = token;
  localStorage['token'] = token;
};

export const removeToken = () => {
  delete instance.defaults.headers.common['x-auth-token'];
  localStorage.removeItem('token');
};

instance.interceptors.response.use(res => res, err => {
  if (err.response) {
    let msg = err.response.data.msg;
    if (err.response.status === 401 && (msg === 'TOKEN NOT RECEIVED' || msg === 'TOKEN NOT VALID')) { store.dispatch(logout()); }
  }
  return Promise.reject(err);
});
