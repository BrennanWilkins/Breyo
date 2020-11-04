import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';

export const dndHandler = (source, destination, boardID) => async dispatch => {
  let sourceID = source.droppableId;
  let targetID = destination.droppableId;
  if (sourceID === 'droppable' && targetID === 'droppable') {
    dispatch({ type: actionTypes.MOVE_LIST, sourceIndex: source.index, destIndex: destination.index });
    await axios.put('/list/moveList', { sourceIndex: source.index, destIndex: destination.index, boardID });
  } else if (sourceID === targetID) {
    dispatch({ type: actionTypes.MOVE_CARD_SAME_LIST, sourceIndex: source.index, destIndex: destination.index, listID: sourceID });
    await axios.put('/card/moveCard/sameList', { sourceIndex: source.index, destIndex: destination.index, listID: sourceID, boardID });
  } else if (sourceID !== targetID) {
    dispatch({ type: actionTypes.MOVE_CARD_DIFF_LIST, sourceIndex: source.index, destIndex: destination.index, sourceID, destID: targetID });
    await axios.put('/card/moveCard/diffList', { sourceIndex: source.index, destIndex: destination.index, sourceID, targetID, boardID });
  }
};
