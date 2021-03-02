import io from 'socket.io-client';
import { instance as axios, baseURL, setToken } from '../axios';
import store from '../store';
import * as actionTypes from '../store/actions/actionTypes';
import { addNotif, serverErr } from '../store/actions/notifications';
import boardSocketMap from './boardSocketMap';
import teamSocketMap from './teamSocketMap';

// socket for board page
let boardSocket = null;

export const initBoardSocket = boardID => {
  if (boardSocket) { return; }
  const newSocket = io(baseURL + '/boards', {
    query: { token: axios.defaults.headers.common['x-auth-token'] }
  });

  newSocket.on('connect', () => {
    newSocket.emit('join', boardID);
  });

  newSocket.on('connect_error', error => {
    if (error.message === 'Unauthorized') {
      newSocket.close();
    }
  });

  newSocket.on('disconnect', reason => {
    if (reason === 'io server disconnect') {
      store.dispatch(addNotif('Connection to server lost, attempting to re-establish...'));
      newSocket.connect();
    }
  });

  // manually handle this route to check if user needs new jwt token
  newSocket.on('post/board/admins', async data => {
    try {
      const email = JSON.parse(data);
      store.dispatch({ type: actionTypes.ADD_ADMIN, email });
      const state = store.getState();
      const userEmail = state.user.email;
      if (email === userEmail) {
        // user was added as admin, fetch new token
        const res = await axios.put('/board/admins/promoteUser', { boardID: state.board.boardID });
        setToken(res.data.token);
        store.dispatch({ type: actionTypes.PROMOTE_SELF, boardID });
      }
    } catch (err) { store.dispatch(serverErr()); }
  });

  // manually handle this route to check if user needs new jwt token
  newSocket.on('delete/board/admins', async data => {
    try {
      const email = JSON.parse(data);
      store.dispatch({ type: actionTypes.REMOVE_ADMIN, email });
      const state = store.getState();
      const userEmail = state.user.email;
      if (email === userEmail) {
        // user was demoted as admin, fetch new token
        const res = await axios.put('/board/admins/demoteUser', { boardID: state.board.boardID });
        setToken(res.data.token);
        store.dispatch({ type: actionTypes.DEMOTE_SELF, boardID });
      }
    } catch (err) { store.dispatch(serverErr()); }
  });

  newSocket.on('delete/board', () => {
    window.location.replace('/');
    store.dispatch(addNotif('This board has been deleted.'));
  });

  for (let route in boardSocketMap) {
    newSocket.on(route, data => {
      const payload = JSON.parse(data);
      store.dispatch({ type: boardSocketMap[route], ...payload });
    });
  }

  boardSocket = newSocket;
};

export const sendBoardUpdate = (type, data) => {
  if (!boardSocket) { return; }
  boardSocket.emit(type, JSON.stringify(data));
};

export const connectBoardSocket = () => {
  if (!boardSocket) { return; }
  boardSocket.connect();
};

export const connectAndGetBoardSocket = () => {
  connectBoardSocket();
  return boardSocket;
};

export const closeBoardSocket = () => {
  if (!boardSocket) { return; }
  boardSocket.close();
};

// socket for team page
let teamSocket = null;

export const initTeamSocket = teamID => {
  if (teamSocket) { return; }
  const newSocket = io(baseURL + '/teams', {
    query: { token: axios.defaults.headers.common['x-auth-token'] }
  });

  newSocket.on('connect', () => {
    newSocket.emit('join', teamID);
  });

  newSocket.on('connect_error', error => {
    if (error.message === 'Unauthorized') {
      newSocket.close();
    }
  });

  newSocket.on('disconnect', reason => {
    if (reason === 'io server disconnect') {
      store.dispatch(addNotif('Connection to server lost, attempting to re-establish...'));
      newSocket.connect();
    }
  });

  newSocket.on('put/team/info', data => {
    const { payload } = JSON.parse(data);

    // if team page url has changed then reload page with new url
    if (payload.url !== window.location.pathname.slice(6)) {
      return window.location.replace(`/team/${payload.url}${window.location.search}`);
    }
    store.dispatch({ type: actionTypes.EDIT_TEAM, payload });
  });

  for (let route in teamSocketMap) {
    newSocket.on(route, data => {
      const payload = JSON.parse(data);
      store.dispatch({ type: teamSocketMap[route], ...payload });
    });
  }

  teamSocket = newSocket;
};

export const sendTeamUpdate = (type, data) => {
  if (!teamSocket) { return; }
  teamSocket.emit(type, JSON.stringify(data));
};

export const connectTeamSocket = () => {
  if (!teamSocket) { return; }
  teamSocket.connect();
};

export const closeTeamSocket = () => {
  if (!teamSocket) { return; }
  teamSocket.close();
};
