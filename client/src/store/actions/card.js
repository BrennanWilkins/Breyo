import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';

export const addCard = (title, boardID, listID) => async dispatch => {
  try {
    const res = await axios.post('/card', { title, boardID, listID });
    dispatch({ type: actionTypes.ADD_CARD, title, listID, cardID: res.data.cardID });
  } catch (err) {
    console.log(err);
  }
};

export const setCardDetails = (cardID, listID) => (dispatch, getState) => {
  const currentCard = cardID ? getState().lists.lists.find(list => list.listID === listID).cards.find(card => card.cardID === cardID) : null;
  const currentListTitle = listID ? getState().lists.lists.find(list => list.listID === listID).title : null;
  dispatch({ type: actionTypes.SET_CARD_DETAILS, cardID, listID, currentCard, currentListTitle });
};

export const updateCardTitle = (title, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.UPDATE_CARD_TITLE, title, cardID, listID });
    await axios.put('/card/title', { title, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const updateCardDesc = (desc, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.UPDATE_CARD_DESC, desc, cardID, listID });
    await axios.put('/card/desc', { desc, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const addCardLabel = (color, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.ADD_CARD_LABEL, color, cardID, listID });
    await axios.put('/card/label/add', { color, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const removeCardLabel = (color, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.REMOVE_CARD_LABEL, color, cardID, listID });
    await axios.put('/card/label/remove', { color, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const toggleDueDateIsComplete = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.TOGGLE_DUE_DATE, cardID, listID });
    await axios.put('/card/dueDate/isComplete', { cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const addDueDate = (dueDate, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.ADD_DUE_DATE, dueDate, cardID, listID });
    await axios.post('/card/dueDate', { dueDate, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const removeDueDate = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.REMOVE_DUE_DATE, cardID, listID });
    await axios.put('/card/dueDate/remove', { cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const addChecklist = (title, cardID, listID, boardID) => async dispatch => {
  try {
    const res = await axios.post('/card/checklist', { title, cardID, listID, boardID });
    dispatch({ type: actionTypes.ADD_CHECKLIST, title, checklistID: res.data.checklistID, cardID, listID });
  } catch (err) {
    dispatch(addNotif('Your checklist could not be created.'));
  }
};

export const deleteChecklist = (checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.DELETE_CHECKLIST, checklistID, cardID, listID });
    await axios.put('/card/checklist/delete', { checklistID, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const addChecklistItem = (title, checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    const res = await axios.post('/card/checklist/item', { title, checklistID, cardID, listID, boardID });
    dispatch({ type: actionTypes.ADD_CHECKLIST_ITEM, title, itemID: res.data.itemID, checklistID, cardID, listID });
  } catch (err) {
    console.log(err);
  }
};

export const toggleChecklistItemIsComplete = (itemID, checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.TOGGLE_CHECKLIST_ITEM, itemID, checklistID, cardID, listID });
    await axios.put('/card/checklist/item/isComplete', { itemID, checklistID, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const editChecklistItem = (title, itemID, checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.EDIT_CHECKLIST_ITEM, title, itemID, checklistID, cardID, listID });
    await axios.put('/card/checklist/item/title', { title, itemID, checklistID, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const deleteChecklistItem = (itemID, checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.DELETE_CHECKLIST_ITEM, itemID, checklistID, cardID, listID });
    await axios.put('/card/checklist/item/delete', { itemID, checklistID, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const copyCard = (title, keepChecklists, keepLabels, cardID, currentCard, sourceListID, destListID, destIndex, boardID) => async dispatch => {
  try {
    const res = await axios.post('/card/copy', { title, keepChecklists, keepLabels, cardID, sourceListID, destListID, destIndex, boardID });
    dispatch({ type: actionTypes.COPY_CARD, title, checklists: res.data.checklists, currentCard, newCardID: res.data.cardID, keepLabels, sourceListID, destListID, destIndex });
  } catch (err) {
    dispatch(addNotif('There was an error while copying the card.'));
  }
};

export const archiveCard = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.ARCHIVE_CARD, cardID, listID });
    await axios.post('/card/archive', { cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const setCardDetailsArchived = (cardID, listID, currentCard) => (dispatch, getState) => {
  // current list may be active or archived
  const currentList = getState().lists.lists.find(list => list.listID === listID) || getState().lists.archivedLists.find(list => list.listID === listID);
  const currentListTitle = currentList.title;
  dispatch({ type: actionTypes.SET_CARD_DETAILS, cardID, listID, currentCard, currentListTitle });
};

export const recoverCard = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.RECOVER_CARD, cardID, listID });
    await axios.put('/card/archive/recover', { cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

export const deleteCard = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch({ type: actionTypes.DELETE_CARD, cardID, listID });
    await axios.put('/card/archive/delete', { cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};
