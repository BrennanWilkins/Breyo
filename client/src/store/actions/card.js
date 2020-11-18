import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';
import { sendUpdate } from './socket';

export const addCard = (title, boardID, listID) => async dispatch => {
  try {
    const res = await axios.post('/card', { title, boardID, listID });
    dispatch({ type: actionTypes.ADD_CARD, title, listID, cardID: res.data.cardID });
    sendUpdate('post/card', JSON.stringify({ title, listID, cardID: res.data.cardID }));
  } catch (err) {
    console.log(err);
  }
};

export const setCardDetails = (cardID, listID) => (dispatch, getState) => {
  const state = getState();
  let currentCard = null;
  if (cardID) {
    currentCard = state.lists.lists.find(list => list.listID === listID).cards.find(card => card.cardID === cardID);
    if (!currentCard) {
      currentCard = state.lists.allArchivedCards.find(card => card.cardID === cardID && card.listID === listID);
      if (!currentCard) { currentCard = null; }
      else { currentCard.isArchived = true; }
    }
  }
  const currentListTitle = listID ? state.lists.lists.find(list => list.listID === listID).title : null;
  if (!currentCard || !currentListTitle) {
    return dispatch({ type: actionTypes.SET_CARD_DETAILS, cardID: null, listID: null, currentCard: null, currentListTitle: null });
  }
  dispatch({ type: actionTypes.SET_CARD_DETAILS, cardID, listID, currentCard, currentListTitle });
};

export const setCardDetailsArchived = (cardID, listID, currentCard) => (dispatch, getState) => {
  // current list may be active or archived
  const lists = getState().lists;
  const currentList = lists.lists.find(list => list.listID === listID) || lists.archivedLists.find(list => list.listID === listID);
  const currentListTitle = currentList.title;
  dispatch({ type: actionTypes.SET_CARD_DETAILS, cardID, listID, currentCard: { ...currentCard, isArchived: true }, currentListTitle });
};

export const updateCardTitle = (title, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.UPDATE_CARD_TITLE, title, cardID, listID });
    await axios.put('/card/title', { title, cardID, listID, boardID });
    sendUpdate('put/card/title', JSON.stringify({ title, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const updateCardDesc = (desc, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.UPDATE_CARD_DESC, desc, cardID, listID });
    await axios.put('/card/desc', { desc, cardID, listID, boardID });
    sendUpdate('put/card/desc', JSON.stringify({ desc, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const addCardLabel = (color, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.ADD_CARD_LABEL, color, cardID, listID });
    await axios.put('/card/label/add', { color, cardID, listID, boardID });
    sendUpdate('put/card/label/add', JSON.stringify({ color, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const removeCardLabel = (color, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.REMOVE_CARD_LABEL, color, cardID, listID });
    await axios.put('/card/label/remove', { color, cardID, listID, boardID });
    sendUpdate('put/card/label/remove', JSON.stringify({ color, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const toggleDueDateIsComplete = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.TOGGLE_DUE_DATE, cardID, listID });
    await axios.put('/card/dueDate/isComplete', { cardID, listID, boardID });
    sendUpdate('put/card/dueDate/isComplete', JSON.stringify({ cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const addDueDate = (dueDate, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.ADD_DUE_DATE, dueDate, cardID, listID });
    await axios.post('/card/dueDate', { dueDate, cardID, listID, boardID });
    sendUpdate('post/card/dueDate', JSON.stringify({ dueDate, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const removeDueDate = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.REMOVE_DUE_DATE, cardID, listID });
    await axios.put('/card/dueDate/remove', { cardID, listID, boardID });
    sendUpdate('put/card/dueDate/remove', JSON.stringify({ cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const addChecklist = (title, cardID, listID, boardID) => async dispatch => {
  try {
    const res = await axios.post('/card/checklist', { title, cardID, listID, boardID });
    dispatch({ type: actionTypes.ADD_CHECKLIST, title, checklistID: res.data.checklistID, cardID, listID });
    sendUpdate('post/card/checklist', JSON.stringify({ title, checklistID: res.data.checklistID, cardID, listID }));
  } catch (err) {
    dispatch(addNotif('Your checklist could not be created.'));
  }
};

export const deleteChecklist = (checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.DELETE_CHECKLIST, checklistID, cardID, listID });
    await axios.put('/card/checklist/delete', { checklistID, cardID, listID, boardID });
    sendUpdate('put/card/checklist/delete', JSON.stringify({ checklistID, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const editChecklistTitle = (title, checklistID) => async (dispatch, getState) => {
  try {
    const state = getState();
    const cardID = state.lists.shownCardID;
    const listID = state.lists.shownListID;
    const boardID = state.board.boardID;
    dispatch({ type: actionTypes.EDIT_CHECKLIST_TITLE, title, checklistID, cardID, listID });
    await axios.put('/card/checklist/title', { title, checklistID, cardID, listID, boardID });
    sendUpdate('put/card/checklist/title', JSON.stringify({ title, checklistID, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const addChecklistItem = (title, checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    const res = await axios.post('/card/checklist/item', { title, checklistID, cardID, listID, boardID });
    dispatch({ type: actionTypes.ADD_CHECKLIST_ITEM, title, itemID: res.data.itemID, checklistID, cardID, listID });
    sendUpdate('post/card/checklist/item', JSON.stringify({ title, itemID: res.data.itemID, checklistID, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const toggleChecklistItemIsComplete = (itemID, checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.TOGGLE_CHECKLIST_ITEM, itemID, checklistID, cardID, listID });
    await axios.put('/card/checklist/item/isComplete', { itemID, checklistID, cardID, listID, boardID });
    sendUpdate('put/card/checklist/item/isComplete', JSON.stringify({ itemID, checklistID, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const editChecklistItem = (title, itemID, checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.EDIT_CHECKLIST_ITEM, title, itemID, checklistID, cardID, listID });
    await axios.put('/card/checklist/item/title', { title, itemID, checklistID, cardID, listID, boardID });
    sendUpdate('put/card/checklist/item/title', JSON.stringify({ title, itemID, checklistID, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const deleteChecklistItem = (itemID, checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.DELETE_CHECKLIST_ITEM, itemID, checklistID, cardID, listID });
    await axios.put('/card/checklist/item/delete', { itemID, checklistID, cardID, listID, boardID });
    sendUpdate('put/card/checklist/item/delete', JSON.stringify({ itemID, checklistID, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const copyCard = (title, keepChecklists, keepLabels, cardID, currentCard, sourceListID, destListID, destIndex, boardID) => async dispatch => {
  try {
    const res = await axios.post('/card/copy', { title, keepChecklists, keepLabels, cardID, sourceListID, destListID, destIndex, boardID });
    dispatch({ type: actionTypes.COPY_CARD, title, checklists: res.data.checklists, currentCard, newCardID: res.data.cardID, keepLabels, sourceListID, destListID, destIndex });
    sendUpdate('post/card/copy', JSON.stringify({ title, checklists: res.data.checklists, currentCard, newCardID: res.data.cardID, keepLabels, sourceListID, destListID, destIndex }));
  } catch (err) {
    dispatch(addNotif('There was an error while copying the card.'));
  }
};

export const archiveCard = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.ARCHIVE_CARD, cardID, listID });
    await axios.post('/card/archive', { cardID, listID, boardID });
    sendUpdate('post/card/archive', JSON.stringify({ cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const recoverCard = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.RECOVER_CARD, cardID, listID });
    await axios.put('/card/archive/recover', { cardID, listID, boardID });
    sendUpdate('put/card/archive/recover', JSON.stringify({ cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const deleteCard = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.DELETE_CARD, cardID, listID });
    await axios.put('/card/archive/delete', { cardID, listID, boardID });
    sendUpdate('put/card/archive/delete', JSON.stringify({ cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const addCardMember = (email, fullName, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.ADD_CARD_MEMBER, email, fullName, cardID, listID });
    await axios.post('/card/members', { email, cardID, listID, boardID });
    sendUpdate('post/card/members', JSON.stringify({ email, fullName, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const removeCardMember = (email, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.REMOVE_CARD_MEMBER, email, cardID, listID });
    await axios.put('/card/members/remove', { email, cardID, listID, boardID });
    sendUpdate('put/card/members/remove', JSON.stringify({ email, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const addComment = msg => async (dispatch, getState) => {
  try {
    const state = getState();
    const cardID = state.lists.shownCardID;
    const listID = state.lists.shownListID;
    const date = String(new Date());
    const res = await axios.post('/card/comments', { msg, cardID, listID, date, boardID: state.board.boardID });
    const payload = { msg, commentID: res.data.commentID, cardID, date, listID, email: state.auth.email, fullName: state.auth.fullName };
    dispatch({ type: actionTypes.ADD_COMMENT, payload });
    sendUpdate('post/card/comments', JSON.stringify(payload));
  } catch (err) {
    console.log(err);
  }
};

export const updateComment = (msg, commentID) => async (dispatch, getState) => {
  try {
    const state = getState();
    const cardID = state.lists.shownCardID;
    const listID = state.lists.shownListID;
    dispatch({ type: actionTypes.UPDATE_COMMENT, msg, commentID, cardID, listID });
    await axios.put('/card/comments', { msg, commentID, cardID, listID, boardID: state.board.boardID });
    sendUpdate('put/card/comments', JSON.stringify({ msg, commentID, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};

export const deleteComment = commentID => async (dispatch, getState) => {
  try {
    const state = getState();
    const cardID = state.lists.shownCardID;
    const listID = state.lists.shownListID;
    dispatch({ type: actionTypes.DELETE_COMMENT, commentID, cardID, listID });
    await axios.put('/card/comments/delete', { commentID, cardID, listID, boardID: state.board.boardID });
    sendUpdate('put/card/comments/delete', JSON.stringify({ commentID, cardID, listID }));
  } catch (err) {
    console.log(err);
  }
};
