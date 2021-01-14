import axios from 'axios';
import { logout } from './store/actions';
import store from './store';

export const instance = axios.create({
  // baseURL: 'http://localhost:9000/api'
  baseURL: 'https://breyo.herokuapp.com/api'
});

instance.interceptors.response.use(res => res, err => {
  if (err.response) {
    let msg = err.response.data.msg;
    if (err.response.status === 401 && (msg === 'TOKEN NOT RECEIVED' || msg === 'TOKEN NOT VALID')) { store.dispatch(logout()); }
  }
  return Promise.reject(err);
});
