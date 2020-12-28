import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif, serverErr } from './notifications';
import { sendUpdate, initSocket, connectSocket } from './socket';
import { addRecentActivity } from './activity';

export const createBoard = (title, color) => async dispatch => {
  try {
    const res = await axios.post('/board', { title, color });
    const { token, board } = res.data;
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage['token'] = token;
    dispatch({ type: actionTypes.CREATE_BOARD, payload: board });
  } catch (err) {
    let msg = err.response && err.response.data.msg ? err.response.data.msg : 'Your board could not be created.';
    dispatch(addNotif(msg));
  }
};

export const toggleIsStarred = boardID => async (dispatch, getState) => {
  try {
    dispatch({ type: actionTypes.TOGGLE_IS_STARRED, boardID });
    const isActive = getState().board.boardID === boardID;
    if (isActive) { dispatch({ type: actionTypes.TOGGLE_IS_STARRED_ACTIVE }); }
    await axios.put('/board/starred', { boardID });
  } catch (err) {
    dispatch(serverErr());
  }
};

const formatCardData = card => {
  let { _id: cardID, comments, checklists, ...restCard } = card;

  comments = comments.map(comment => {
    const { _id: commentID, ...restComment } = comment;
    return { ...restComment, commentID };
  }).reverse();

  checklists = checklists.map(checklist => ({
    title: checklist.title,
    checklistID: checklist._id,
    items: checklist.items.map(item => ({
      itemID: item._id,
      title: item.title,
      isComplete: item.isComplete
    }))
  }));

  return { cardID, comments, checklists, ...restCard };
};

export const updateActiveBoard = data => (dispatch, getState) => {
  const { _id: boardID, members, desc, creatorEmail, color, title, activity } = data;
  const state = getState();
  const activeBoard = state.auth.boards.find(board => board.boardID === boardID);
  let { isStarred, isAdmin: userIsAdmin } = activeBoard;
  const { isAdmin, ...creator} = data.members.find(member => member.email === creatorEmail);

  if (data.invites && data.boards) {
    const userEmail = state.auth.email;
    userIsAdmin = members.find(member => member.email === userEmail).isAdmin;
    dispatch({ type: actionTypes.UPDATE_USER_DATA, invites: data.invites, boards: data.boards });
  }

  if (data.token) { axios.defaults.headers.common['x-auth-token'] = data.token; }

  const boardPayload = { isStarred, creator, userIsAdmin, title, members, color, boardID, desc };
  dispatch({ type: actionTypes.UPDATE_ACTIVE_BOARD, payload: boardPayload });

  const avatars = {};
  for (let member of data.members) { avatars[member.email] = member.avatar; }
  dispatch({ type: actionTypes.SET_BOARD_AVATARS, avatars });

  let allArchivedCards = [];
  let allComments = [];
  let lists = data.lists.map(list => {
    const { _id: listID, indexInBoard, title, isArchived } = list;
    const cards = list.cards.map(card => {
      const formatted = formatCardData(card);
      allComments = allComments.concat(formatted.comments.map(comment => ({ ...comment, cardTitle: card.title })));
      return formatted;
    });
    const archivedCards = list.archivedCards.map(card => {
      const formatted = formatCardData(card);
      allComments = allComments.concat(formatted.comments.map(comment => ({ ...comment, cardTitle: card.title })));
      return formatted;
    });
    allArchivedCards = allArchivedCards.concat(archivedCards.map(card => ({ ...card, listID })));
    return { indexInBoard, listID, title, isArchived, cards };
  });
  const archivedLists = lists.filter(list => list.isArchived);
  lists = lists.filter(list => !list.isArchived);

  const listPayload = { lists, allArchivedCards, archivedLists };
  dispatch({ type: actionTypes.SET_LIST_DATA, payload: listPayload });

  allComments.sort((a, b) => new Date(b.date) - new Date(a.date));

  const activityPayload = { activity, allComments };
  dispatch({ type: actionTypes.SET_BOARD_ACTIVITY, payload: activityPayload });
};

export const updateBoardTitle = (title, boardID) => async dispatch => {
  try {
    const res = await axios.put('/board/title', { boardID, title });
    sendUpdate('put/board/title', JSON.stringify({ title, boardID }));
    dispatch({ type: actionTypes.UPDATE_BOARD_TITLE, title, boardID });
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const sendInvite = (email, boardID) => async dispatch => {
  try {
    await axios.post('/board/invites', { email, boardID });
  } catch (err) {
    let msg = err.response && err.response.data.msg ? err.response.data.msg : 'There was an error while sending your invite.';
    dispatch(addNotif(msg));
  }
}

export const addAdmin = (email, boardID) => async dispatch => {
  try {
    const res = await axios.post('/board/admins', { email, boardID });
    dispatch({ type: actionTypes.ADD_ADMIN, email, boardID });
    sendUpdate('post/board/admins', email);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(addNotif('There was an error while changing user permissions.'));
  }
};

export const removeAdmin = (email, boardID) => async dispatch => {
  try {
    const res = await axios.delete(`/board/admins/${email}/${boardID}`);
    dispatch({ type: actionTypes.REMOVE_ADMIN, email, boardID });
    sendUpdate('delete/board/admins', email);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(addNotif('There was an error while changing user permissions.'));
  }
};

export const demoteSelf = boardID => ({ type: actionTypes.DEMOTE_SELF, boardID });

export const updateColor = color => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    dispatch({ type: actionTypes.UPDATE_COLOR, color, boardID });
    await axios.put('/board/color', { color, boardID });
    sendUpdate('put/board/color', JSON.stringify({ color, boardID }));
  } catch (err) {
    dispatch(serverErr());
  }
};

export const updateBoardDesc = desc => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    dispatch({ type: actionTypes.UPDATE_BOARD_DESC, desc });
    const res = await axios.put('/board/desc', { desc, boardID });
    sendUpdate('put/board/desc', JSON.stringify({ desc }));
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const deleteBoard = push => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    await axios.delete('/board/' + boardID);
    sendUpdate('delete/board', JSON.stringify({ boardID }));
    dispatch({ type: actionTypes.DELETE_BOARD, boardID });
    push('/');
  } catch (err) {
    dispatch(addNotif('There was an error while deleting the board.'));
  }
};

export const acceptInvite = (boardID, email, fullName, push) => async (dispatch, getState) => {
  try {
    const res = await axios.put('/board/invites/accept', { boardID });
    const { token, invites, boards, newActivity } = res.data;
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage['token'] = token;
    // manually connect socket
    initSocket(boardID);
    connectSocket();
    // automatically send user to the board
    push(`/board/${boardID}`);
    dispatch({ type: actionTypes.UPDATE_USER_DATA, invites, boards });
    addRecentActivity(newActivity);
    sendUpdate('post/board/newMember', JSON.stringify({ email, fullName }));
  } catch (err) {
    if (err.response && err.response.status === 400) {
      dispatch({ type: actionTypes.REMOVE_INVITE, boardID });
      return dispatch(addNotif('This board no longer exists.'));
    }
    dispatch(addNotif('There was an error while joining the board.'));
  }
};

export const rejectInvite = boardID => async dispatch => {
  try {
    dispatch({ type: actionTypes.REMOVE_INVITE, boardID });
    await axios.put('/board/invites/reject', { boardID });
  } catch (err) {
    dispatch(serverErr());
  }
};

export const leaveBoard = push => async (dispatch, getState) => {
  try {
    const state = getState();
    const boardID = state.board.boardID;
    const email = state.auth.email;
    const res = await axios.put('/board/leave', { boardID });
    addRecentActivity(res.data.newActivity);
    sendUpdate('put/board/memberLeft', JSON.stringify({ email }));
    dispatch({ type: actionTypes.LEAVE_BOARD, boardID });
    push('/');
  } catch (err) {
    dispatch(addNotif('There was an error while leaving the board.'));
  }
};

export const openRoadmap = () => (dispatch, getState) => {
  const state = getState();
  if (!state.board.shownRoadmapListID) {
    const listID = state.lists.lists[0].listID;
    dispatch({ type: actionTypes.SET_SHOWN_ROADMAP_LIST, listID });
  }
  dispatch({ type: actionTypes.OPEN_ROADMAP });
};

export const closeRoadmap = () => ({ type: actionTypes.CLOSE_ROADMAP });

export const openRoadmapList = listID => dispatch => {
  dispatch({ type: actionTypes.OPEN_ROADMAP });
  dispatch({ type: actionTypes.SET_SHOWN_ROADMAP_LIST, listID });
};

export const setShownRoadmapList = listID => ({ type: actionTypes.SET_SHOWN_ROADMAP_LIST, listID });

export const toggleCreateBoard = () => ({ type: actionTypes.TOGGLE_CREATE_BOARD });
