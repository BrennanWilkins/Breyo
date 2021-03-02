import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { sendBoardUpdate } from '../../socket/socket';
import { serverErr } from './notifications';
import { getCardState } from './card';

export const dndHandler = (source, destination, draggableID, boardID) => async (dispatch, getState) => {
  try {
    const state = getState();
    // sourceID & targetID will be 'droppable' if list is being moved, else if card moved then they will be the source/target lists' listIDs
    let { droppableId: sourceID, index: sourceIndex } = source;
    let { droppableId: targetID, index: destIndex } = destination;
    if (sourceID === 'droppable' && targetID === 'droppable') {
      dispatch({ type: actionTypes.MOVE_LIST, sourceIndex, destIndex });
      await axios.put('/list/moveList', { sourceIndex, destIndex, boardID }).catch(err => {
        // if server error then undo move list
        dispatch({ type: actionTypes.MOVE_LIST, sourceIndex: destIndex, destIndex: sourceIndex });
        throw err;
      });
      sendBoardUpdate('put/list/moveList', { sourceIndex, destIndex });
    } else if (sourceID === targetID) {
      // if cards are currently being filtered, then need to find the true unfiltered sourceIndex for the card
      if (state.lists.cardsAreFiltered) {
        sourceIndex = state.lists.lists.find(list => list.listID === sourceID).cards.findIndex(card => card.cardID === draggableID);
        if (sourceIndex === -1) { throw new Error('card not found'); }
      }
      const payload = { sourceIndex, destIndex, listID: sourceID };
      dispatch({ type: actionTypes.MOVE_CARD_SAME_LIST, ...payload });
      await axios.put('/card/moveCard/sameList', { ...payload, boardID }).catch(err => {
        // if server error then undo move card
        dispatch({ type: actionTypes.MOVE_CARD_SAME_LIST, sourceIndex: destIndex, destIndex: sourceIndex, listID: sourceID });
        throw err;
      });
      sendBoardUpdate('put/card/moveCard/sameList', payload);
    } else if (sourceID !== targetID) {
      // if cards are currently being filtered, then need to find the true unfiltered sourceIndex for the card
      if (state.lists.cardsAreFiltered) {
        sourceIndex = state.lists.lists.find(list => list.listID === sourceID).cards.findIndex(card => card.cardID === draggableID);
        if (sourceIndex === -1) { throw new Error('card not found'); }
      }
      const payload = { sourceIndex, destIndex, sourceID, destID: targetID };
      dispatch({ type: actionTypes.MOVE_CARD_DIFF_LIST, ...payload });
      await axios.put('/card/moveCard/diffList', { sourceIndex, destIndex, sourceID, targetID, boardID }).catch(err => {
        // if server error then undo move card
        dispatch({ type: actionTypes.MOVE_CARD_DIFF_LIST, sourceIndex: destIndex, destIndex: sourceIndex, sourceID: targetID, destID: sourceID });
        throw err;
      });
      sendBoardUpdate('put/card/moveCard/diffList', payload);
    }
  } catch (err) { dispatch(serverErr()); }
};

export const manualMoveCardHandler = (sourceID, destID, sourceIndex, destIndex) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    if (sourceID === destID) {
      const payload = { sourceIndex, destIndex, listID: sourceID };
      await axios.put('/card/moveCard/sameList', { ...payload, boardID });
      dispatch({ type: actionTypes.MOVE_CARD_SAME_LIST, ...payload });
      sendBoardUpdate('put/card/moveCard/sameList', payload);
    } else {
      await axios.put('/card/moveCard/diffList', { sourceIndex, destIndex, sourceID, targetID: destID, boardID });
      const payload = { sourceIndex, destIndex, sourceID, destID };
      dispatch({ type: actionTypes.MOVE_CARD_DIFF_LIST, ...payload });
      sendBoardUpdate('put/card/moveCard/diffList', payload);
    }
  } catch (err) { dispatch(serverErr()); }
};

export const checklistDndHandler = (sourceIndex, destIndex, checklistID) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { sourceIndex, destIndex, checklistID, cardID, listID };
    dispatch({ type: actionTypes.MOVE_CHECKLIST_ITEM, ...payload });
    await axios.put('/card/checklist/moveItem', { ...payload, boardID }).catch(err => {
      // if server error then undo move item
      dispatch({ type: actionTypes.MOVE_CHECKLIST_ITEM, sourceIndex: destIndex, destIndex: sourceIndex, checklistID, cardID, listID });
      throw err;
    });
    sendBoardUpdate('put/card/checklist/moveItem', payload);
  } catch (err) { dispatch(serverErr()); }
};

export const customFieldDndHandler = (sourceIndex, destIndex) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    const payload = { sourceIndex, destIndex, cardID, listID, boardID };
    dispatch({ type: actionTypes.MOVE_CUSTOM_FIELD, ...payload });
    await axios.put('/card/customField/move', payload).catch(err => {
      // if server error then undo move field
      dispatch({ type: actionTypes.MOVE_CUSTOM_FIELD, sourceIndex: destIndex, destIndex: sourceIndex, cardID, listID });
      throw err;
    });
    sendBoardUpdate('put/card/customField/move', payload);
  } catch (err) { dispatch(serverErr()); }
};
