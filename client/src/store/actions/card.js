import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif, serverErr } from './notifications';
import { sendUpdate } from './socket';
import { addRecentActivity } from './activity';

export const getCardState = getState => {
  // helper func for retrieving cardID/listID/boardID for card details actions
  const state = getState();
  return { boardID: state.board.boardID, listID: state.lists.shownListID, cardID: state.lists.shownCardID, state };
};

export const addCard = (title, listID) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    const res = await axios.post('/card', { title, boardID, listID });
    const payload = { title, listID, cardID: res.data.cardID };
    dispatch({ type: actionTypes.ADD_CARD, ...payload });
    sendUpdate('post/card', payload);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

const setCardDetailsNull = dispatch => dispatch({ type: actionTypes.SET_CARD_DETAILS, cardID: null, listID: null, currentCard: null, currentListTitle: null });

const findCard = (cardID, listID, dispatch, getState, callback) => {
  const state = getState();
  // card's listID could be in lists or archived lists
  let list = state.lists.lists.find(list => list.listID === listID) || state.lists.archivedLists.find(list => list.listID === listID);
  if (!list) { return callback(); }
  let currentListTitle = list.title;
  let currentCard = null;
  currentCard = list.cards.find(card => card.cardID === cardID);
  if (!currentCard) {
    // card not found in lists or archived lists, check in archivedCards
    currentCard = state.lists.allArchivedCards.find(card => card.cardID === cardID && card.listID === listID);
    // card not found anywhere
    if (!currentCard) { return callback(); }
    currentCard = { ...currentCard, isArchived: true, listIsVoting: list.isVoting };
  } else {
    currentCard = { ...currentCard, listIsVoting: list.isVoting };
    // if card found in archivedLists then set list is archived
    if (list.isArchived) { currentCard.listIsArchived = true; }
  }
  dispatch({ type: actionTypes.SET_CARD_DETAILS, cardID, listID, currentCard, currentListTitle });
};

export const setCardDetails = (cardID, listID) => (dispatch, getState) => {
  // if card being closed then IDs will be null
  if (!cardID || !listID) { return setCardDetailsNull(dispatch); }
  return findCard(cardID, listID, dispatch, getState, () => setCardDetailsNull(dispatch));
};

export const setCardDetailsInitial = (cardID, listID, push) => (dispatch, getState) => findCard(cardID, listID, dispatch, getState, () => push());

export const updateCardTitle = title => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { title, cardID, listID };
    dispatch({ type: actionTypes.UPDATE_CARD_TITLE, ...payload });
    const res = await axios.put('/card/title', { ...payload, boardID });
    sendUpdate('put/card/title', payload);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const updateCardDesc = desc => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { desc, cardID, listID };
    dispatch({ type: actionTypes.UPDATE_CARD_DESC, ...payload });
    await axios.put('/card/desc', { ...payload, boardID });
    sendUpdate('put/card/desc', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const addCardLabel = color => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { color, cardID, listID };
    dispatch({ type: actionTypes.ADD_CARD_LABEL, ...payload });
    await axios.post('/card/label', { ...payload, boardID });
    sendUpdate('post/card/label', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const removeCardLabel = color => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { color, cardID, listID };
    dispatch({ type: actionTypes.REMOVE_CARD_LABEL, ...payload });
    await axios.put('/card/label/remove', { ...payload, boardID });
    sendUpdate('put/card/label/remove', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const changeRoadmapLabel = color => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    if (color) {
      const payload = { color, cardID, listID };
      dispatch({ type: actionTypes.ADD_ROADMAP_LABEL, ...payload });
      await axios.post('/card/roadmapLabel', { ...payload, boardID });
      sendUpdate('post/card/roadmapLabel', payload);
    } else {
      dispatch({ type: actionTypes.REMOVE_ROADMAP_LABEL, cardID, listID });
      await axios.delete(`/card/roadmapLabel/${cardID}/${listID}/${boardID}`);
      sendUpdate('delete/card/roadmapLabel', { cardID, listID });
    }
  } catch (err) {
    dispatch(serverErr());
  }
};

export const toggleDueDateIsComplete = () => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    dispatch({ type: actionTypes.TOGGLE_DUE_DATE, cardID, listID });
    const res = await axios.put('/card/dueDate/isComplete', { cardID, listID, boardID });
    sendUpdate('put/card/dueDate/isComplete', { cardID, listID });
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const addDueDate = (startDate, dueDate) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { startDate, dueDate, cardID, listID };
    dispatch({ type: actionTypes.ADD_DUE_DATE, ...payload });
    const res = await axios.post('/card/dueDate', { ...payload, boardID });
    sendUpdate('post/card/dueDate', payload);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const removeDueDate = () => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    dispatch({ type: actionTypes.REMOVE_DUE_DATE, cardID, listID });
    const res = await axios.delete(`/card/dueDate/${cardID}/${listID}/${boardID}`);
    sendUpdate('delete/card/dueDate', { cardID, listID });
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const addChecklist = title => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const res = await axios.post('/card/checklist', { title, cardID, listID, boardID });
    const payload = { title, checklistID: res.data.checklistID, cardID, listID };
    dispatch({ type: actionTypes.ADD_CHECKLIST, ...payload });
    sendUpdate('post/card/checklist', payload);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(addNotif('Your checklist could not be created.'));
  }
};

export const deleteChecklist = checklistID => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { checklistID, cardID, listID };
    const res = await axios.delete(`/card/checklist/${checklistID}/${cardID}/${listID}/${boardID}`);
    dispatch({ type: actionTypes.DELETE_CHECKLIST, ...payload });
    sendUpdate('delete/card/checklist', payload);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const editChecklistTitle = (title, checklistID) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { title, checklistID, cardID, listID };
    dispatch({ type: actionTypes.EDIT_CHECKLIST_TITLE, ...payload });
    const res = await axios.put('/card/checklist/title', { ...payload, boardID });
    sendUpdate('put/card/checklist/title', payload);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const addChecklistItem = (title, checklistID) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const res = await axios.post('/card/checklist/item', { title, checklistID, cardID, listID, boardID });
    const payload = { title, itemID: res.data.itemID, checklistID, cardID, listID };
    dispatch({ type: actionTypes.ADD_CHECKLIST_ITEM, ...payload });
    sendUpdate('post/card/checklist/item', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const toggleChecklistItemIsComplete = (itemID, checklistID) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { itemID, checklistID, cardID, listID };
    dispatch({ type: actionTypes.TOGGLE_CHECKLIST_ITEM, ...payload });
    const res = await axios.put('/card/checklist/item/isComplete', { ...payload, boardID });
    sendUpdate('put/card/checklist/item/isComplete', payload);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const editChecklistItem = (title, itemID, checklistID) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { title, itemID, checklistID, cardID, listID };
    dispatch({ type: actionTypes.EDIT_CHECKLIST_ITEM, ...payload });
    await axios.put('/card/checklist/item/title', { ...payload, boardID });
    sendUpdate('put/card/checklist/item/title', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const deleteChecklistItem = (itemID, checklistID) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { itemID, checklistID, cardID, listID };
    await axios.put('/card/checklist/item/delete', { ...payload, boardID });
    dispatch({ type: actionTypes.DELETE_CHECKLIST_ITEM, ...payload });
    sendUpdate('put/card/checklist/item/delete', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const copyCard = (title, keepChecklists, keepLabels, destListID, destIndex) => async (dispatch, getState) => {
  try {
    const state = getState();
    const boardID = state.board.boardID;
    const sourceListID = state.lists.shownListID;
    const cardID = state.lists.shownCardID;
    const currentCard = state.lists.currentCard;
    const res = await axios.post('/card/copy', { title, keepChecklists, keepLabels, cardID, sourceListID, destListID, destIndex, boardID });
    const payload = { title, checklists: res.data.checklists, customFields: res.data.customFields, currentCard,
      newCardID: res.data.cardID, keepLabels, sourceListID, destListID, destIndex };
    dispatch({ type: actionTypes.COPY_CARD, ...payload });
    sendUpdate('post/card/copy', payload);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(addNotif('There was an error while copying the card.'));
  }
};

export const archiveCard = () => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const res = await axios.post('/card/archive', { cardID, listID, boardID });
    dispatch({ type: actionTypes.ARCHIVE_CARD, cardID, listID });
    sendUpdate('post/card/archive', { cardID, listID });
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const recoverCard = (cardID, listID, boardID) => async dispatch => {
  try {
    const payload = { cardID, listID };
    dispatch({ type: actionTypes.RECOVER_CARD, ...payload });
    const res = await axios.put('/card/archive/recover', { ...payload, boardID }).catch(err => {
      // if server error while recovering card then undo recover
      dispatch({ type: actionTypes.ARCHIVE_CARD, ...payload });
      throw err;
    });
    sendUpdate('put/card/archive/recover', payload);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const deleteCard = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.DELETE_CARD, cardID, listID });
    const res = await axios.delete(`/card/archive/${cardID}/${listID}/${boardID}`);
    const { activity } = res.data;
    dispatch({ type: actionTypes.UPDATE_BOARD_ACTIVITY_DELETE_CARD, activity });
    sendUpdate('put/activity/board/deleteCard', { activity, cardID });
    sendUpdate('delete/card/archive', { cardID, listID });
  } catch (err) {
    dispatch(serverErr());
  }
};

export const addCardMember = (email, fullName) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { email, fullName, cardID, listID };
    dispatch({ type: actionTypes.ADD_CARD_MEMBER, ...payload });
    const res = await axios.post('/card/members', { email, cardID, listID, boardID });
    sendUpdate('post/card/members', payload);
    addRecentActivity(res.data.newActivity);
  } catch (err) {
    dispatch(serverErr());
  }
};

const removeCardMemberHelper = async (dispatch, email, cardID, listID, boardID) => {
  const payload = { email, cardID, listID };
  dispatch({ type: actionTypes.REMOVE_CARD_MEMBER, ...payload });
  const res = await axios.delete(`/card/members/${email}/${cardID}/${listID}/${boardID}`);
  sendUpdate('delete/card/members', payload);
  addRecentActivity(res.data.newActivity);
};

export const removeCardMemberCurrentCard = email => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    await removeCardMemberHelper(dispatch, email, cardID, listID, boardID);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const removeCardMember = (email, cardID, listID) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    await removeCardMemberHelper(dispatch, email, cardID, listID, boardID);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const addComment = msg => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID, state } = getCardState(getState);
    const res = await axios.post('/card/comments', { msg, cardID, listID, boardID });
    const { commentID, cardTitle, date } = res.data;
    const payload = { msg, commentID, cardID, date, listID, email: state.user.email, fullName: state.user.fullName };
    dispatch({ type: actionTypes.ADD_COMMENT, payload, cardTitle });
    sendUpdate('post/card/comments', { payload, cardTitle });
  } catch (err) {
    dispatch(serverErr());
  }
};

export const updateComment = (msg, commentID) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { msg, commentID, cardID, listID };
    dispatch({ type: actionTypes.UPDATE_COMMENT, ...payload });
    await axios.put('/card/comments', { ...payload, boardID });
    sendUpdate('put/card/comments', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const deleteComment = commentID => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { commentID, cardID, listID };
    dispatch({ type: actionTypes.DELETE_COMMENT, ...payload });
    await axios.delete(`/card/comments/${commentID}/${cardID}/${listID}/${boardID}`);
    sendUpdate('delete/card/comments', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const toggleCommentLike = commentID => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID, state } = getCardState(getState);
    const email = state.user.email;
    const payload = { commentID, cardID, listID, email };
    dispatch({ type: actionTypes.TOGGLE_COMMENT_LIKE, ...payload });
    await axios.put('/card/comments/like', { commentID, cardID, listID, boardID });
    sendUpdate('put/card/comments/like', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const addCustomField = (fieldType, fieldTitle) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { boardID, listID, cardID, fieldType, fieldTitle };
    const res = await axios.post('/card/customField', payload);
    payload.fieldID = res.data.fieldID;
    dispatch({ type: actionTypes.ADD_CUSTOM_FIELD, ...payload });
    sendUpdate('post/card/customField', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const updateCustomFieldTitle = (fieldID, fieldTitle) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { boardID, listID, cardID, fieldID, fieldTitle };
    dispatch({ type: actionTypes.UPDATE_CUSTOM_FIELD_TITLE, ...payload });
    await axios.put('/card/customField/title', payload);
    sendUpdate('put/card/customField/title', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const updateCustomFieldValue = (fieldID, value) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { boardID, listID, cardID, fieldID, value };
    dispatch({ type: actionTypes.UPDATE_CUSTOM_FIELD_VALUE, ...payload });
    await axios.put('/card/customField/value', payload);
    sendUpdate('put/card/customField/value', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const deleteCustomField = fieldID => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { listID, cardID, fieldID };
    dispatch({ type: actionTypes.DELETE_CUSTOM_FIELD, ...payload });
    await axios.delete(`/card/customField/${fieldID}/${cardID}/${listID}/${boardID}`);
    sendUpdate('delete/card/customField', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};

export const toggleCardVote = () => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID, state } = getCardState(getState);
    const email = state.user.email;
    const fullName = state.user.fullName;
    const payload = { boardID, listID, cardID, email, fullName };
    dispatch({ type: actionTypes.TOGGLE_CARD_VOTE, ...payload });
    await axios.post('/card/vote', { boardID, listID, cardID });
    sendUpdate('post/card/vote', payload);
  } catch (err) {
    dispatch(serverErr());
  }
};
