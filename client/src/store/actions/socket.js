import { instance as axios } from '../../axios';
import io from 'socket.io-client';
import store from '../../store';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';

let socket = null;

export const initSocket = boardID => {
  const newSocket = io('http://localhost:9000/', {
    query: { token: axios.defaults.headers.common['x-auth-token'] }
  });

  newSocket.on('connect', () => {
    newSocket.emit('join', boardID);
  });

  newSocket.on('joined', () => {
    console.log('connected');
  });

  newSocket.on('unauthorized', () => {
    console.log('Not a member');
  });

  newSocket.on('connect_error', error => {
    if (error.message === 'Unauthorized') {
      console.log('Unauthorized');
      newSocket.close();
    }
  });

  newSocket.on('disconnect', reason => {
    if (reason === 'io server disconnect') {
      store.dispatch(addNotif('Connection to server lost, attempting to re-establish...'));
      newSocket.connect();
    }
  });

  newSocket.on('put/board/title', title => {
    store.dispatch({ type: actionTypes.UPDATE_BOARD_TITLE, title });
  });

  newSocket.on('put/board/color', color => {
    store.dispatch({ type: actionTypes.UPDATE_COLOR, color });
  });

  newSocket.on('put/board/desc', desc => {
    store.dispatch({ type: actionTypes.UPDATE_BOARD_DESC, desc });
  });

  newSocket.on('put/board/admins/add', email => {
    store.dispatch({ type: actionTypes.ADD_ADMIN, email });
    const userEmail = store.getState().auth.email;
    if (email === userEmail) { store.dispatch({ type: actionTypes.PROMOTE_SELF, boardID }); }
  });

  newSocket.on('put/board/admins/remove', email => {
    store.dispatch({ type: actionTypes.REMOVE_ADMIN, email });
    const userEmail = store.getState().auth.email;
    if (email === userEmail) { store.dispatch({ type: actionTypes.DEMOTE_SELF, boardID }); }
  });

  newSocket.on('put/list/moveList', data => {
    const { sourceIndex, destIndex } = JSON.parse(data);
    store.dispatch({ type: actionTypes.MOVE_LIST, sourceIndex, destIndex });
  });

  newSocket.on('put/card/moveCard/sameList', data => {
    const { sourceIndex, destIndex, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.MOVE_CARD_SAME_LIST, sourceIndex, destIndex, listID });
  });

  newSocket.on('put/card/moveCard/diffList', data => {
    const { sourceIndex, destIndex, sourceID, destID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.MOVE_CARD_DIFF_LIST, sourceIndex, destIndex, sourceID, destID });
  });

  newSocket.on('put/list/title', data => {
    const { title, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.UPDATE_LIST_TITLE, title, listID });
  });

  newSocket.on('post/list', data => {
    const { title, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.ADD_LIST, title, listID });
  });

  newSocket.on('post/list/copy', data => {
    const { newList } = JSON.parse(data);
    store.dispatch({ type: actionTypes.COPY_LIST, newList });
  });

  newSocket.on('post/list/archive', listID => {
    store.dispatch({ type: actionTypes.ARCHIVE_LIST, listID });
  });

  newSocket.on('put/list/archive/recover', listID => {
    store.dispatch({ type: actionTypes.RECOVER_LIST, listID });
  });

  newSocket.on('put/list/archive/delete', listID => {
    store.dispatch({ type: actionTypes.DELETE_LIST, listID });
  });

  newSocket.on('put/list/archive/allCards', listID => {
    store.dispatch({ type: actionTypes.ARCHIVE_ALL_CARDS, listID });
  });

  newSocket.on('put/list/moveAllCards', data => {
    const { oldListID, newListID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.MOVE_ALL_CARDS, oldListID, newListID });
  });

  newSocket.on('post/card', data => {
    const { title, listID, cardID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.ADD_CARD, title, listID, cardID });
  });

  newSocket.on('put/card/title', data => {
    const { title, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.UPDATE_CARD_TITLE, title, cardID, listID });
  });

  newSocket.on('put/card/label/add', data => {
    const { color, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.ADD_CARD_LABEL, color, cardID, listID });
  });

  newSocket.on('put/card/label/remove', data => {
    const { color, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.REMOVE_CARD_LABEL, color, cardID, listID });
  });

  newSocket.on('put/card/dueDate/isComplete', data => {
    const { cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.TOGGLE_DUE_DATE, cardID, listID });
  });

  newSocket.on('post/card/dueDate', data => {
    const { dueDate, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.ADD_DUE_DATE, dueDate, cardID, listID });
  });

  newSocket.on('put/card/dueDate/remove', data => {
    const { cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.REMOVE_DUE_DATE, cardID, listID });
  });

  newSocket.on('post/card/checklist', data => {
    const { title, checklistID, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.ADD_CHECKLIST, title, checklistID, cardID, listID });
  });

  newSocket.on('put/card/checklist/delete', data => {
    const { checklistID, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.DELETE_CHECKLIST, checklistID, cardID, listID });
  });

  newSocket.on('put/card/checklist/title', data => {
    const { title, checklistID, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.EDIT_CHECKLIST_TITLE, title, checklistID, cardID, listID });
  });

  newSocket.on('post/card/checklist/item', data => {
    const { title, itemID, checklistID, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.ADD_CHECKLIST_ITEM, title, itemID, checklistID, cardID, listID });
  });

  newSocket.on('put/card/checklist/item/isComplete', data => {
    const { itemID, checklistID, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.TOGGLE_CHECKLIST_ITEM, itemID, checklistID, cardID, listID });
  });

  newSocket.on('put/card/checklist/item/title', data => {
    const { title, itemID, checklistID, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.EDIT_CHECKLIST_ITEM, title, itemID, checklistID, cardID, listID });
  });

  newSocket.on('put/card/checklist/item/delete', data => {
    const { itemID, checklistID, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.DELETE_CHECKLIST_ITEM, itemID, checklistID, cardID, listID });
  });

  newSocket.on('post/card/copy', data => {
    const parsed = JSON.parse(data);
    store.dispatch({ type: actionTypes.COPY_CARD, ...parsed });
  });

  newSocket.on('post/card/archive', data => {
    const { cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.ARCHIVE_CARD, cardID, listID });
  });

  newSocket.on('put/card/archive/recover', data => {
    const { cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.RECOVER_CARD, cardID, listID });
  });

  newSocket.on('put/card/archive/delete', data => {
    const { cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.DELETE_CARD, cardID, listID });
  });

  newSocket.on('post/card/members', data => {
    const { email, fullName, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.ADD_CARD_MEMBER, email, fullName, cardID, listID });
  });

  newSocket.on('put/card/members/remove', data => {
    const { email, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.REMOVE_CARD_MEMBER, email, cardID, listID });
  });

  newSocket.on('post/card/comments', data => {
    const payload = JSON.parse(data);
    store.dispatch({ type: actionTypes.ADD_COMMENT, payload });
  });

  newSocket.on('put/card/comments', data => {
    const { msg, commentID, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.UPDATE_COMMENT, msg, commentID, cardID, listID });
  });

  newSocket.on('put/card/comments/delete', data => {
    const { commentID, cardID, listID } = JSON.parse(data);
    store.dispatch({ type: actionTypes.DELETE_COMMENT, commentID, cardID, listID });
  });

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
