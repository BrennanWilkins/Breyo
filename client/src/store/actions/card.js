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
