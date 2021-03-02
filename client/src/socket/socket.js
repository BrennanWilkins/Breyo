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
  const newBoardSocket = io(baseURL + '/boards', {
    query: { token: axios.defaults.headers.common['x-auth-token'] }
  });

  newBoardSocket.on('connect', () => {
    newBoardSocket.emit('join', boardID);
  });

  newBoardSocket.on('connect_error', error => {
    if (error.message === 'Unauthorized') {
      newBoardSocket.close();
    }
  });

  newBoardSocket.on('disconnect', reason => {
    if (reason === 'io server disconnect') {
      store.dispatch(addNotif('Connection to server lost, attempting to re-establish...'));
      newBoardSocket.connect();
    }
  });

  // manually handle this route to check if user needs new jwt token
  newBoardSocket.on('post/board/admins', async data => {
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
  newBoardSocket.on('delete/board/admins', async data => {
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

  newBoardSocket.on('delete/board', () => {
    store.dispatch(addNotif('This board has been deleted.'));
    window.location.replace('/');
  });

  for (let route in boardSocketMap) {
    newBoardSocket.on(route, data => {
      const payload = JSON.parse(data);
      store.dispatch({ type: boardSocketMap[route], ...payload });
    });
  }

  boardSocket = newBoardSocket;
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
  const newTeamSocket = io(baseURL + '/teams', {
    query: { token: axios.defaults.headers.common['x-auth-token'] }
  });

  newTeamSocket.on('connect', () => {
    newTeamSocket.emit('join', teamID);
  });

  newTeamSocket.on('connect_error', error => {
    if (error.message === 'Unauthorized') {
      newTeamSocket.close();
    }
  });

  newTeamSocket.on('disconnect', reason => {
    if (reason === 'io server disconnect') {
      store.dispatch(addNotif('Connection to server lost, attempting to re-establish...'));
      newTeamSocket.connect();
    }
  });

  newTeamSocket.on('put/team/info', data => {
    const { payload } = JSON.parse(data);

    // if team page url has changed then reload page with new url
    if (payload.url !== window.location.pathname.slice(6)) {
      return window.location.replace(`/team/${payload.url}${window.location.search}`);
    }
    store.dispatch({ type: actionTypes.EDIT_TEAM, payload });
  });

  newTeamSocket.on('delete/team', () => {
    store.dispatch(addNotif('This team has been deleted.'));
    window.location.replace('/');
  });

  for (let route in teamSocketMap) {
    newTeamSocket.on(route, data => {
      const payload = JSON.parse(data);
      store.dispatch({ type: teamSocketMap[route], ...payload });
    });
  }

  teamSocket = newTeamSocket;
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
