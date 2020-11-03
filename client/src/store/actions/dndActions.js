import { instance as axios } from '../../axios';
import * as actionTypes from './actionTypes';

const updateListPos = (sourceIndex, destIndex) => ({ type: actionTypes.MOVE_LIST, sourceIndex, destIndex });

const moveCardSameList = (sourceIndex, destIndex, listID) => ({ type: actionTypes.MOVE_CARD_SAME_LIST, sourceIndex, destIndex, listID });

const moveCardDiffList = (sourceIndex, destIndex, sourceID, destID) => ({ type: actionTypes.MOVE_CARD_DIFF_LIST, sourceIndex, destIndex, sourceID, destID });

export const dndHandler = (source, destination, boardID) => async dispatch => {
  let sourceID = source.droppableId;
  let targetID = destination.droppableId;
  if (sourceID === 'droppable' && targetID === 'droppable') {
    dispatch(updateListPos(source.index, destination.index));
    await axios.put('/list/moveList', { sourceIndex: source.index, destIndex: destination.index, boardID });
  } else if (sourceID === targetID) {
    dispatch(moveCardSameList(source.index, destination.index, sourceID));
    await axios.put('/card/moveCard/sameList', { sourceIndex: source.index, destIndex: destination.index, listID: sourceID, boardID });
  } else if (sourceID !== targetID) {
    dispatch(moveCardDiffList(source.index, destination.index, sourceID, targetID));
    await axios.put('/card/moveCard/diffList', { sourceIndex: source.index, destIndex: destination.index, sourceID, targetID, boardID });
  }
};
