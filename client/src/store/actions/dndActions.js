import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { sendUpdate } from './socket';
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
      sendUpdate('put/list/moveList', JSON.stringify({ sourceIndex, destIndex }));
    } else if (sourceID === targetID) {
      // if cards are currently being filtered, then need to find the true unfiltered sourceIndex for the card
      if (state.lists.cardsAreFiltered) {
        sourceIndex = state.lists.lists.find(list => list.listID === sourceID).cards.findIndex(card => card.cardID === draggableID);
        if (sourceIndex === -1) { throw new Error('card not found'); }
      }
      dispatch({ type: actionTypes.MOVE_CARD_SAME_LIST, sourceIndex, destIndex, listID: sourceID });
      await axios.put('/card/moveCard/sameList', { sourceIndex, destIndex, listID: sourceID, boardID }).catch(err => {
        // if server error then undo move card
        dispatch({ type: actionTypes.MOVE_CARD_SAME_LIST, sourceIndex: destIndex, destIndex: sourceIndex, listID: sourceID });
        throw err;
      });
      sendUpdate('put/card/moveCard/sameList', JSON.stringify({ sourceIndex, destIndex, listID: sourceID }));
    } else if (sourceID !== targetID) {
      // if cards are currently being filtered, then need to find the true unfiltered sourceIndex for the card
      if (state.lists.cardsAreFiltered) {
        sourceIndex = state.lists.lists.find(list => list.listID === sourceID).cards.findIndex(card => card.cardID === draggableID);
        if (sourceIndex === -1) { throw new Error('card not found'); }
      }
      dispatch({ type: actionTypes.MOVE_CARD_DIFF_LIST, sourceIndex, destIndex, sourceID, destID: targetID });
      await axios.put('/card/moveCard/diffList', { sourceIndex, destIndex, sourceID, targetID, boardID }).catch(err => {
        // if server error then undo move card
        dispatch({ type: actionTypes.MOVE_CARD_DIFF_LIST, sourceIndex: destIndex, destIndex: sourceIndex, sourceID: targetID, destID: sourceID });
        throw err;
      });
      sendUpdate('put/card/moveCard/diffList', JSON.stringify({ sourceIndex, destIndex, sourceID, destID: targetID }));
    }
  } catch (err) { dispatch(serverErr()); }
};

export const manualMoveCardHandler = (sourceListID, destListID, sourceIndex, destIndex) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    if (sourceListID === destListID) {
      const listID = sourceListID;
      await axios.put('/card/moveCard/sameList', { sourceIndex, destIndex, listID, boardID });
      dispatch({ type: actionTypes.MOVE_CARD_SAME_LIST, sourceIndex, destIndex, listID });
      sendUpdate('put/card/moveCard/sameList', JSON.stringify({ sourceIndex, destIndex, listID }));
    } else {
      await axios.put('/card/moveCard/diffList', { sourceIndex, destIndex, sourceID: sourceListID, targetID: destListID, boardID });
      dispatch({ type: actionTypes.MOVE_CARD_DIFF_LIST, sourceIndex, destIndex, sourceID: sourceListID, destID: destListID });
      sendUpdate('put/card/moveCard/diffList', JSON.stringify({ sourceIndex, destIndex, sourceID: sourceListID, destID: destListID }));
    }
  } catch (err) { dispatch(serverErr()); }
};

export const checklistDndHandler = (sourceIndex, destIndex, checklistID) => async (dispatch, getState) => {
  try {
    const { boardID, listID, cardID } = getCardState(getState);
    dispatch({ type: actionTypes.MOVE_CHECKLIST_ITEM, sourceIndex, destIndex, checklistID, cardID, listID });
    await axios.put('/card/checklist/moveItem', { sourceIndex, destIndex, checklistID, cardID, listID, boardID }).catch(err => {
      // if server error then undo move item
      dispatch({ type: actionTypes.MOVE_CHECKLIST_ITEM, sourceIndex: destIndex, destIndex: sourceIndex, checklistID, cardID, listID });
      throw err;
    });
    sendUpdate('put/card/checklist/moveItem', JSON.stringify({ sourceIndex, destIndex, checklistID, cardID, listID }));
  } catch (err) { dispatch(serverErr()); }
};
