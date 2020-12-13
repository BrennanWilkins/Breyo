import { instance as axios } from '../../axios';
import io from 'socket.io-client';
import store from '../../store';
import * as actionTypes from './actionTypes';
import { addNotif, serverErr } from './notifications';
import socketMap from './socketMap';

let socket = null;

export const initSocket = boardID => {
  if (socket) { return; }
  const newSocket = io('http://localhost:9000/', {
    query: { token: axios.defaults.headers.common['x-auth-token'] }
  });

  newSocket.on('connect', () => {
    newSocket.emit('join', boardID);
  });

  // newSocket.on('joined', () => {
  //   console.log('connected');
  // });

  // newSocket.on('unauthorized', () => {
  //   console.log('Not a member');
  // });

  newSocket.on('connect_error', error => {
    if (error.message === 'Unauthorized') {
      // console.log('Unauthorized');
      newSocket.close();
    }
  });

  newSocket.on('disconnect', reason => {
    // console.log('disconnected:', reason);
    if (reason === 'io server disconnect') {
      store.dispatch(addNotif('Connection to server lost, attempting to re-establish...'));
      newSocket.connect();
    }
  });

  newSocket.on('post/board/admins', async email => {
    try {
      store.dispatch({ type: actionTypes.ADD_ADMIN, email });
      const state = store.getState();
      const userEmail = state.auth.email;
      if (email === userEmail) {
        // user was added as admin, fetch new token
        const res = await axios.put('/board/admins/promoteUser', { boardID: state.board.boardID });
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
        store.dispatch({ type: actionTypes.PROMOTE_SELF, boardID });
      }
    } catch (err) { store.dispatch(serverErr()); }
  });

  newSocket.on('delete/board/admins', async email => {
    try {
      store.dispatch({ type: actionTypes.REMOVE_ADMIN, email });
      const state = store.getState();
      const userEmail = state.auth.email;
      if (email === userEmail) {
        // user was demoted as admin, fetch new token
        const res = await axios.put('/board/admins/demoteUser', { boardID: state.board.boardID });
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
        store.dispatch({ type: actionTypes.DEMOTE_SELF, boardID });
      }
    } catch (err) { store.dispatch(serverErr()); }
  });

  for (let route in socketMap) {
    newSocket.on(route, data => {
      const payload = JSON.parse(data);
      store.dispatch({ type: socketMap[route], ...payload });
    });
  }

  socket = newSocket;
};

export const sendUpdate = (type, msg) => {
  if (!socket) { return; }
  socket.emit(type, msg);
};

export const connectSocket = () => {
  if (!socket) { return; }
  socket.connect();
};

export const closeSocket = () => {
  if (!socket) { return; }
  socket.close();
};
