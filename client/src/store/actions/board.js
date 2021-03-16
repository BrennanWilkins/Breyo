import { instance as axios, setToken } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif, serverErr, permissionErr } from './notifications';
import { sendBoardUpdate, initBoardSocket, connectAndGetBoardSocket } from '../../socket/socket';
import { addRecentActivity } from './activity';

export const createBoard = (title, color) => async dispatch => {
  try {
    const res = await axios.post('/board', { title, color });
    const { token, board } = res.data;
    setToken(token);
    dispatch({ type: actionTypes.CREATE_BOARD, board });
  } catch (err) {
    const errMsg = err?.response?.data?.msg || 'Your board could not be created.';
    dispatch(addNotif(errMsg));
  }
};

export const createTeamBoard = (title, color, teamID) => async dispatch => {
  try {
    const res = await axios.post('/board/teamBoard', { title, color, teamID });
    const { token, board } = res.data;
    setToken(token);
    dispatch({ type: actionTypes.CREATE_BOARD, board });
  } catch (err) {
    dispatch(addNotif('Your board could not be created.'));
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
  let { _id: cardID, comments, checklists, customFields, ...restCard } = card;

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
      isComplete: item.isComplete,
      member: item.member,
      dueDate: item.dueDate
    }))
  }));

  return { cardID, comments, checklists, customFields, ...restCard };
};

export const updateActiveBoard = data => (dispatch, getState) => {
  const { _id: boardID, members, desc, creator, color, title, activity, teamID } = data;
  const state = getState();
  const activeBoard = state.user.boards.byID[boardID];
  let { isStarred, isAdmin: userIsAdmin } = activeBoard;

  const avatars = {};
  for (let member of data.members) {
    avatars[member.email] = member.avatar;
    if (member.email === creator.email) { creator.avatar = member.avatar; }
  }

  const allCustomLabelsIDs = [];
  const customLabelsByID = {};
  for (let label of data.customLabels) {
    customLabelsByID[label._id] = { color: label.color, title: label.title };
    allCustomLabelsIDs.push(label._id);
  }

  const allCustomFieldIDs = [];
  const customFieldsByID = {};
  for (let field of data.customFields) {
    allCustomFieldIDs.push(field._id);
    customFieldsByID[field._id] = { fieldType: field.fieldType, fieldTitle: field.fieldTitle };
  }

  let team = { teamID, title: '', url: null };
  if (teamID && !data.team) {
    const teamData = state.user.teams.byID[teamID];
    team.title = teamData.title;
    team.url = teamData.url;
  } else if (teamID && data.team) {
    team.title = data.team.title;
  }

  if (data.invites && data.boards && data.teamInvites) {
    const userEmail = state.user.email;
    userIsAdmin = members.find(member => member.email === userEmail).isAdmin;
    dispatch({ type: actionTypes.UPDATE_USER_BOARDS, invites: data.invites, boards: data.boards, teamInvites: data.teamInvites });
  }

  if (data.token) { setToken(data.token); }

  const boardPayload = { isStarred, creator, userIsAdmin, title, members, color, boardID, desc, team, avatars,
    customLabels: { allIDs: allCustomLabelsIDs, byID: customLabelsByID }, customFields: { allIDs: allCustomFieldIDs, byID: customFieldsByID } };
  dispatch({ type: actionTypes.UPDATE_ACTIVE_BOARD, payload: boardPayload });

  let allArchivedCards = [];
  let allComments = [];
  let lists = data.lists.map(list => {
    const { _id: listID, indexInBoard, title, isArchived, isVoting, limit } = list;
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
    return { indexInBoard, listID, title, isArchived, cards, isVoting, limit };
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
    const payload = { title, boardID };
    const res = await axios.put('/board/title', payload);
    sendBoardUpdate('put/board/title', payload);
    dispatch({ type: actionTypes.UPDATE_BOARD_TITLE, ...payload });
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const sendInvite = (email, boardID) => async dispatch => {
  try {
    await axios.post('/board/invites', { email, boardID });
  } catch (err) {
    const errMsg = err?.response?.status === 403 ? 'You must be a board admin to invite other users.' :
    (err?.response?.data?.msg || 'There was an error while sending your invite.');
    dispatch(addNotif(errMsg));
  }
};

export const addAdmin = (email, boardID) => async dispatch => {
  try {
    const res = await axios.post('/board/admins', { email, boardID });
    dispatch({ type: actionTypes.ADD_ADMIN, email, boardID });
    sendBoardUpdate('post/board/admins', email);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(permissionErr(err));
  }
};

export const removeAdmin = (email, boardID) => async dispatch => {
  try {
    const res = await axios.delete(`/board/admins/${email}/${boardID}`);
    dispatch({ type: actionTypes.REMOVE_ADMIN, email, boardID });
    sendBoardUpdate('delete/board/admins', email);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(permissionErr(err));
  }
};

export const demoteSelf = boardID => dispatch => {
  dispatch({ type: actionTypes.DEMOTE_SELF, boardID });
  axios.get('/auth/newToken').then(res => setToken(res.data.token))
  .catch(err => dispatch(serverErr()));
};

export const updateColor = color => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const payload = { color, boardID };
    dispatch({ type: actionTypes.UPDATE_COLOR, ...payload });
    await axios.put('/board/color', payload);
    sendBoardUpdate('put/board/color', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const updateBoardDesc = desc => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    dispatch({ type: actionTypes.UPDATE_BOARD_DESC, desc });
    const res = await axios.put('/board/desc', { desc, boardID });
    sendBoardUpdate('put/board/desc', { desc });
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const deleteBoard = push => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    await axios.delete('/board/' + boardID);
    sendBoardUpdate('delete/board', { boardID });
    dispatch({ type: actionTypes.DELETE_BOARD, boardID });
    push('/');
  } catch (err) {
    const errMsg = err?.response?.status === 403 ? 'You must be a board admin to delete this board.' :
    'There was an error while deleting the board.';
    dispatch(addNotif(errMsg));
  }
};

export const acceptInvite = (boardID, push) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { email, fullName, avatar } = state.user;
    const res = await axios.put(`/board/invites/${boardID}`);
    const { token, board, newActivity } = res.data;
    setToken(token);

    dispatch({ type: actionTypes.JOIN_BOARD, board });
    // manually connect socket and once joined send update to other members
    initBoardSocket(boardID);
    const socket = connectAndGetBoardSocket();
    socket.on('joined', () => {
      // remove listener once joined
      socket.off('joined');
      addRecentActivity(newActivity);
      sendBoardUpdate('post/board/newMember', { email, fullName, avatar });
    });
    // automatically send user to the board
    push(`/board/${boardID}`);
  } catch (err) {
    if (err?.response?.status === 400) {
      dispatch({ type: actionTypes.REMOVE_INVITE, boardID });
      return dispatch(addNotif('This board no longer exists.'));
    }
    dispatch(addNotif('There was an error while joining the board.'));
  }
};

export const rejectInvite = boardID => async dispatch => {
  try {
    dispatch({ type: actionTypes.REMOVE_INVITE, boardID });
    await axios.delete(`/board/invites/${boardID}`);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const leaveBoard = push => async (dispatch, getState) => {
  try {
    const state = getState();
    const boardID = state.board.boardID;
    const email = state.user.email;
    const res = await axios.put('/board/leave', { boardID });
    addRecentActivity(res.data.newActivity);
    sendBoardUpdate('put/board/memberLeft', { email });
    dispatch({ type: actionTypes.LEAVE_BOARD, boardID });
    push('/');
  } catch (err) {
    dispatch(addNotif('There was an error while leaving the board.'));
  }
};

export const setShownBoardView = view => ({ type: actionTypes.SET_SHOWN_BOARD_VIEW, view });

export const resetBoardView = () => dispatch => {
  dispatch({ type: actionTypes.SET_SHOWN_BOARD_VIEW, view: 'lists' });
  dispatch({ type: actionTypes.RESET_ROADMAP_SETTINGS });
};

export const toggleCreateBoard = () => ({ type: actionTypes.TOGGLE_CREATE_BOARD });

export const openCreateTeamBoard = teamID => ({ type: actionTypes.TOGGLE_CREATE_BOARD, teamID });

export const changeCreateBoardTeam = teamID => ({ type: actionTypes.SET_CREATE_BOARD_TEAM, teamID });

export const createCustomLabel = (color, title) => async (dispatch, getState) => {
  try {
    const payload = { boardID: getState().board.boardID, color, title };
    const res = await axios.post('/board/customLabel', payload);
    payload.labelID = res.data.labelID;
    dispatch({ type: actionTypes.CREATE_NEW_CUSTOM_LABEL, ...payload });
    sendBoardUpdate('post/board/customLabel', payload);
  } catch (err) {
    dispatch(addNotif('There was an error while creating your label.'));
  }
};

export const updateCustomLabel = (labelID, color, title) => async (dispatch, getState) => {
  try {
    const payload = { boardID: getState().board.boardID, labelID, color, title };
    dispatch({ type: actionTypes.UPDATE_CUSTOM_LABEL, ...payload });
    await axios.put('/board/customLabel', payload);
    sendBoardUpdate('put/board/customLabel', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const deleteCustomLabel = labelID => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    dispatch({ type: actionTypes.DELETE_CUSTOM_LABEL, labelID });
    await axios.delete(`/board/customLabel/${boardID}/${labelID}`);
    sendBoardUpdate('delete/board/customLabel', { labelID });
  } catch (err) {
    dispatch(serverErr());
  }
};

export const createCustomField = (fieldType, fieldTitle) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const payload = { fieldType, fieldTitle, boardID };
    const res = await axios.post('/board/customField', payload);
    payload.fieldID = res.data.fieldID;
    dispatch({ type: actionTypes.CREATE_CUSTOM_FIELD, ...payload });
    sendBoardUpdate('post/board/customField', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const updateCustomFieldTitle = (fieldID, fieldTitle) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const payload = { fieldID, fieldTitle, boardID };
    dispatch({ type: actionTypes.UPDATE_CUSTOM_FIELD_TITLE, ...payload });
    await axios.put('/board/customField/title', payload);
    sendBoardUpdate('put/board/customField/title', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const deleteCustomField = fieldID => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    dispatch({ type: actionTypes.DELETE_CUSTOM_FIELD, fieldID });
    await axios.delete(`/board/customField/${boardID}/${fieldID}`);
    sendBoardUpdate('delete/board/customField', { fieldID });
  } catch (err) {
    dispatch(serverErr());
  }
};
