import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import { sendUpdate } from './socket';
import { serverErr } from './notifications';

export const dndHandler = (source, destination, boardID) => async dispatch => {
  try {
    // sourceID & targetID will be 'droppable' if list is being moved, else if card moved then they will be the source/target lists' listIDs
    let sourceID = source.droppableId;
    let targetID = destination.droppableId;
    if (sourceID === 'droppable' && targetID === 'droppable') {
      dispatch({ type: actionTypes.MOVE_LIST, sourceIndex: source.index, destIndex: destination.index });
      await axios.put('/list/moveList', { sourceIndex: source.index, destIndex: destination.index, boardID }).catch(err => {
        // if server error then undo move list
        dispatch({ type: actionTypes.MOVE_LIST, sourceIndex: destination.index, destIndex: source.index });
        throw err;
      });
      sendUpdate('put/list/moveList', JSON.stringify({ sourceIndex: source.index, destIndex: destination.index }));
    } else if (sourceID === targetID) {
      dispatch({ type: actionTypes.MOVE_CARD_SAME_LIST, sourceIndex: source.index, destIndex: destination.index, listID: sourceID });
      await axios.put('/card/moveCard/sameList', { sourceIndex: source.index, destIndex: destination.index, listID: sourceID, boardID }).catch(err => {
        // if server error then undo move card
        dispatch({ type: actionTypes.MOVE_CARD_SAME_LIST, sourceIndex: destination.index, destIndex: source.index, listID: sourceID });
        throw err;
      });
      sendUpdate('put/card/moveCard/sameList', JSON.stringify({ sourceIndex: source.index, destIndex: destination.index, listID: sourceID }));
    } else if (sourceID !== targetID) {
      dispatch({ type: actionTypes.MOVE_CARD_DIFF_LIST, sourceIndex: source.index, destIndex: destination.index, sourceID, destID: targetID });
      await axios.put('/card/moveCard/diffList', { sourceIndex: source.index, destIndex: destination.index, sourceID, targetID, boardID }).catch(err => {
        // if server error then undo move card
        dispatch({ type: actionTypes.MOVE_CARD_DIFF_LIST, sourceIndex: destination.index, destIndex: source.index, sourceID: targetID, destID: sourceID });
        throw err;
      });
      sendUpdate('put/card/moveCard/diffList', JSON.stringify({ sourceIndex: source.index, destIndex: destination.index, sourceID, destID: targetID }));
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
