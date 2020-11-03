import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { addNotif } from './notifications';

const addCardDispatch = (title, listID, cardID) => ({ type: actionTypes.ADD_CARD, title, listID, cardID });

export const addCard = (title, boardID, listID) => async dispatch => {
  try {
    const res = await axios.post('/card', { title, boardID, listID });
    dispatch(addCardDispatch(title, listID, res.data.cardID));
  } catch (err) {
    console.log(err);
  }
};

export const setCardDetails = (cardID, listID) => ({ type: actionTypes.SET_CARD_DETAILS, cardID, listID });

const updateCardTitleDispatch = (title, cardID, listID) => ({ type: actionTypes.UPDATE_CARD_TITLE, title, cardID, listID });

export const updateCardTitle = (title, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch(updateCardTitleDispatch(title, cardID, listID));
    await axios.put('/card/title', { title, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

const updateCardDescDispatch = (desc, cardID, listID) => ({ type: actionTypes.UPDATE_CARD_DESC, desc, cardID, listID });

export const updateCardDesc = (desc, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch(updateCardDescDispatch(desc, cardID, listID));
    await axios.put('/card/desc', { desc, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

const addLabel = (color, cardID, listID) => ({ type: actionTypes.ADD_CARD_LABEL, color, cardID, listID });

export const addCardLabel = (color, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch(addLabel(color, cardID, listID));
    await axios.put('/card/label/add', { color, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

const removeLabel = (color, cardID, listID) => ({ type: actionTypes.REMOVE_CARD_LABEL, color, cardID, listID });

export const removeCardLabel = (color, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch(removeLabel(color, cardID, listID));
    await axios.put('/card/label/remove', { color, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

const toggleIsCompleteDispatch = (cardID, listID) => ({ type: actionTypes.TOGGLE_DUE_DATE, cardID, listID });

export const toggleDueDateIsComplete = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch(toggleIsCompleteDispatch(cardID, listID));
    await axios.put('/card/dueDate/isComplete', { cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

const addDueDateDispatch = (dueDate, cardID, listID) => ({ type: actionTypes.ADD_DUE_DATE, dueDate, cardID, listID });

export const addDueDate = (dueDate, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch(addDueDateDispatch(dueDate, cardID, listID));
    await axios.post('/card/dueDate', { dueDate, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

const removeDueDateDispatch = (cardID, listID) => ({ type: actionTypes.REMOVE_DUE_DATE, cardID, listID });

export const removeDueDate = (cardID, listID, boardID) => async dispatch => {
  try {
    dispatch(removeDueDateDispatch(cardID, listID));
    await axios.put('/card/dueDate/remove', { cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

const addChecklistDispatch = (title, checklistID, cardID, listID) => ({ type: actionTypes.ADD_CHECKLIST, title, checklistID, cardID, listID });

export const addChecklist = (title, cardID, listID, boardID) => async dispatch => {
  try {
    const res = await axios.post('/card/checklist', { title, cardID, listID, boardID });
    dispatch(addChecklistDispatch(title, res.data.checklistID, cardID, listID));
  } catch (err) {
    dispatch(addNotif('Your checklist could not be created.'));
  }
};

const deleteChecklistDispatch = (checklistID, cardID, listID) => ({ type: actionTypes.DELETE_CHECKLIST, checklistID, cardID, listID });

export const deleteChecklist = (checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch(deleteChecklistDispatch(checklistID, cardID, listID));
    await axios.put('/card/checklist/delete', { checklistID, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

const addChecklistItemDispatch = (title, itemID, checklistID, cardID, listID) => ({ type: actionTypes.ADD_CHECKLIST_ITEM, title, itemID, checklistID, cardID, listID });

export const addChecklistItem = (title, checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    const res = await axios.post('/card/checklist/item', { title, checklistID, cardID, listID, boardID });
    dispatch(addChecklistItemDispatch(title, res.data.itemID, checklistID, cardID, listID));
  } catch (err) {
    console.log(err);
  }
};

const toggleItemDispatch = (itemID, checklistID, cardID, listID) => ({ type: actionTypes.TOGGLE_CHECKLIST_ITEM, itemID, checklistID, cardID, listID });

export const toggleChecklistItemIsComplete = (itemID, checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch(toggleItemDispatch(itemID, checklistID, cardID, listID));
    await axios.put('/card/checklist/item/isComplete', { itemID, checklistID, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

const editItemDispatch = (title, itemID, checklistID, cardID, listID) => ({ type: actionTypes.EDIT_CHECKLIST_ITEM, title, itemID, checklistID, cardID, listID });

export const editChecklistItem = (title, itemID, checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch(editItemDispatch(title, itemID, checklistID, cardID, listID));
    await axios.put('/card/checklist/item/title', { title, itemID, checklistID, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};

const deleteItemDispatch = (itemID, checklistID, cardID, listID) => ({ type: actionTypes.DELETE_CHECKLIST_ITEM, itemID, checklistID, cardID, listID });

export const deleteChecklistItem = (itemID, checklistID, cardID, listID, boardID) => async dispatch => {
  try {
    dispatch(deleteItemDispatch(itemID, checklistID, cardID, listID));
    await axios.put('/card/checklist/item/delete', { itemID, checklistID, cardID, listID, boardID });
  } catch (err) {
    console.log(err);
  }
};
