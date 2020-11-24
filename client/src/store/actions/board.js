import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';
import { sendUpdate, initSocket, connectSocket } from './socket';
import { addRecentActivity } from './activity';

export const createBoard = (title, color) => async dispatch => {
  try {
    const res = await axios.post('/board', { title, color });
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    localStorage['token'] = res.data.token;
    dispatch({ type: actionTypes.CREATE_BOARD, payload: res.data.board });
  } catch (err) {
    let msg = err.response && err.response.data.msg ? err.response.data.msg : 'Your board could not be created.';
    dispatch(addNotif(msg));
  }
};

export const toggleIsStarred = (id, isActive) => async dispatch => {
  try {
    dispatch({ type: actionTypes.TOGGLE_IS_STARRED, id });
    if (isActive) { dispatch({ type: actionTypes.TOGGLE_IS_STARRED_ACTIVE }); }
    await axios.put('/board/starred', { boardID: id });
  } catch (err) {
    console.log(err);
  }
};

export const updateActiveBoard = data => (dispatch, getState) => {
  const activeBoard = getState().auth.boards.find(board => board.boardID === data._id);
  const isStarred = activeBoard.isStarred;
  const userMember = data.members.find(member => member.email === data.creatorEmail);
  const creatorFullName = userMember.fullName;
  const userIsAdmin = userMember.isAdmin;

  if (data.invites && data.boards) {
    dispatch({ type: actionTypes.UPDATE_USER_DATA, invites: data.invites, boards: data.boards });
  }

  if (data.token) { axios.defaults.headers.common['x-auth-token'] = data.token; }

  const boardPayload = { isStarred, creatorFullName, userIsAdmin, title: data.title, members: data.members,
    color: data.color, boardID: data._id, desc: data.desc, creatorEmail: data.creatorEmail };
  dispatch({ type: actionTypes.UPDATE_ACTIVE_BOARD, payload: boardPayload });

  let allArchivedCards = [];
  let allComments = [];
  let lists = data.lists.map(list => {
    const cards = list.cards.map(card => {
      const comments = card.comments.map(comment => ({
        email: comment.email,
        fullName: comment.fullName,
        cardID: comment.cardID,
        listID: comment.listID,
        date: comment.date,
        commentID: comment._id,
        msg: comment.msg
      })).sort((a,b) => new Date(b.date) - new Date(a.date));
      allComments = allComments.concat(comments.map(comment => ({...comment, cardTitle: card.title})));
      return {
        cardID: card._id,
        checklists: card.checklists.map(checklist => ({
          title: checklist.title,
          checklistID: checklist._id,
          items: checklist.items.map(item => ({
            itemID: item._id,
            title: item.title,
            isComplete: item.isComplete
          }))
        })),
        dueDate: card.dueDate,
        labels: card.labels,
        title: card.title,
        desc: card.desc,
        members: card.members,
        comments
      };
    });
    const archivedCards = list.archivedCards.map(card => {
      const comments = card.comments.map(comment => ({
        email: comment.email,
        fullName: comment.fullName,
        cardID: comment.cardID,
        listID: comment.listID,
        date: comment.date,
        commentID: comment._id,
        msg: comment.msg
      })).sort((a,b) => new Date(b.date) - new Date(a.date));
      allComments = allComments.concat(comments.map(comment => ({ ...comment, cardTitle: card.title })));
      return {
        cardID: card._id,
        checklists: card.checklists.map(checklist => ({
          title: checklist.title,
          checklistID: checklist._id,
          items: checklist.items.map(item => ({
            itemID: item._id,
            title: item.title,
            isComplete: item.isComplete
          }))
        })),
        dueDate: card.dueDate,
        labels: card.labels,
        title: card.title,
        desc: card.desc,
        members: card.members,
        comments
      };
    });
    allArchivedCards = allArchivedCards.concat(archivedCards.map(card => ({ ...card, listID: list._id })));
    return {
      indexInBoard: list.indexInBoard,
      listID: list._id,
      title: list.title,
      isArchived: list.isArchived,
      cards
    };
  }).sort((a,b) => a.indexInBoard - b.indexInBoard);
  const archivedLists = lists.filter(list => list.isArchived);
  lists = lists.filter(list => !list.isArchived);

  const listPayload = { lists, allArchivedCards, archivedLists };
  dispatch({ type: actionTypes.SET_LIST_DATA, payload: listPayload });

  allComments.sort((a, b) => new Date(b.date) - new Date(a.date));
  const combinedActivity = data.activity.concat(allComments).sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 20);
  const activityPayload = { activity: combinedActivity, allComments };
  dispatch({ type: actionTypes.SET_BOARD_ACTIVITY, payload: activityPayload });
};

export const updateBoardTitle = (title, boardID) => async dispatch => {
  try {
    const res = await axios.put('/board/title', { boardID, title });
    sendUpdate('put/board/title', JSON.stringify({ title, boardID }));
    dispatch({ type: actionTypes.UPDATE_BOARD_TITLE, title, boardID });
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    console.log(err);
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
    console.log(err);
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
    console.log(err);
  }
};

export const updateBoardDesc = desc => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    dispatch({ type: actionTypes.UPDATE_BOARD_DESC, desc });
    const res = await axios.put('/board/desc', { desc, boardID });
    sendUpdate('put/board/desc', JSON.stringify({ desc }));
    addRecentActivity(res.data.newActivity);
  } catch (err) { console.log(err); }
};

export const deleteBoard = () => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    await axios.delete('/board/' + boardID);
    dispatch({ type: actionTypes.DELETE_BOARD, boardID });
  } catch (err) {
    dispatch(addNotif('There was an error while deleting the board.'));
  }
};

export const acceptInvite = (boardID, email, fullName, push) => async (dispatch, getState) => {
  try {
    const res = await axios.put('/board/invites/accept', { boardID });
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    localStorage['token'] = res.data.token;
    // manually connect socket
    initSocket(boardID);
    connectSocket();
    // automatically send user to the board
    push(`/board/${boardID}`);
    addRecentActivity(res.data.newActivity);
    dispatch({ type: actionTypes.UPDATE_USER_DATA, invites: res.data.invites, boards: res.data.boards });
    sendUpdate('post/board/newMember', JSON.stringify({ email, fullName }));
  } catch (err) {
    dispatch(addNotif('There was an error while joining the board.'));
  }
};

export const rejectInvite = boardID => async dispatch => {
  try {
    dispatch({ type: actionTypes.REMOVE_INVITE, boardID });
    await axios.put('/board/invites/reject', { boardID });
  } catch (err) {
    console.log(err);
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
