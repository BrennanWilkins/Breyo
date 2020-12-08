import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { sendUpdate } from './socket';
import { serverErr } from './notifications';

export const dndHandler = (source, destination, boardID) => async dispatch => {
  try {
    let sourceID = source.droppableId;
    let targetID = destination.droppableId;
    if (sourceID === 'droppable' && targetID === 'droppable') {
      dispatch({ type: actionTypes.MOVE_LIST, sourceIndex: source.index, destIndex: destination.index });
      await axios.put('/list/moveList', { sourceIndex: source.index, destIndex: destination.index, boardID });
      sendUpdate('put/list/moveList', JSON.stringify({ sourceIndex: source.index, destIndex: destination.index }));
    } else if (sourceID === targetID) {
      dispatch({ type: actionTypes.MOVE_CARD_SAME_LIST, sourceIndex: source.index, destIndex: destination.index, listID: sourceID });
      await axios.put('/card/moveCard/sameList', { sourceIndex: source.index, destIndex: destination.index, listID: sourceID, boardID });
      sendUpdate('put/card/moveCard/sameList', JSON.stringify({ sourceIndex: source.index, destIndex: destination.index, listID: sourceID }));
    } else if (sourceID !== targetID) {
      dispatch({ type: actionTypes.MOVE_CARD_DIFF_LIST, sourceIndex: source.index, destIndex: destination.index, sourceID, destID: targetID });
      await axios.put('/card/moveCard/diffList', { sourceIndex: source.index, destIndex: destination.index, sourceID, targetID, boardID });
      sendUpdate('put/card/moveCard/diffList', JSON.stringify({ sourceIndex: source.index, destIndex: destination.index, sourceID, destID: targetID }));
    }
  } catch (err) {
    dispatch(serverErr());
  }
};

export const manualMoveCardHandler = (sourceListID, destListID, sourceIndex, destIndex) => async (dispatch, getState) => {
  try {
    const boardID = getState().board.boardID;
    if (sourceListID === destListID) {
      const listID = sourceListID;
      dispatch({ type: actionTypes.MOVE_CARD_SAME_LIST, sourceIndex, destIndex, listID });
      await axios.put('/card/moveCard/sameList', { sourceIndex, destIndex, listID, boardID });
      sendUpdate('put/card/moveCard/sameList', JSON.stringify({ sourceIndex, destIndex, listID }));
    } else {
      dispatch({ type: actionTypes.MOVE_CARD_DIFF_LIST, sourceIndex, destIndex, sourceID: sourceListID, destID: destListID });
      await axios.put('/card/moveCard/diffList', { sourceIndex, destIndex, sourceID: sourceListID, targetID: destListID, boardID });
      sendUpdate('put/card/moveCard/diffList', JSON.stringify({ sourceIndex, destIndex, sourceID: sourceListID, destID: destListID }));
    }
  } catch (err) { dispatch(serverErr()); }
};
