import * as actionTypes from '../actions/actionTypes';
import { checkBoardActivity, updateActivityListID } from './reducerUtils';

const initialState = {
  boardActivity: [],
  cardActivity: [],
  shownCardActivityID: '',
  cardActivityLoading: false,
  shownMemberActivity: null,
  allBoardActivity: [],
  allComments: [],
  allBoardActivityLoading: false,
  allBoardActivityErr: false,
  allBoardActivityShown: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESET_CARD_ACTIVITY: return resetCardActivity(state, action);
    case actionTypes.SET_CARD_ACTIVITY: return setCardActivity(state, action);
    case actionTypes.CARD_ACTIVITY_LOADING : return { ...state, cardActivityLoading: action.bool };
    case actionTypes.SET_SHOWN_MEMBER_ACTIVITY: return { ...state, shownMemberActivity: action.member };
    case actionTypes.DELETE_BOARD_ACTIVITY: return deleteBoardActivity(state, action);
    case actionTypes.ADD_RECENT_ACTIVITY: return addRecentActivity(state, action);
    case actionTypes.MOVE_CARD_DIFF_LIST: return moveCardDiffList(state, action);
    case actionTypes.SET_BOARD_ACTIVITY: return setBoardActivity(state, action);
    case actionTypes.UPDATE_BOARD_ACTIVITY_DELETE_CARD: return updateBoardActivityDeleteCard(state, action);
    case actionTypes.UPDATE_BOARD_ACTIVITY_DELETE_LIST: return updateBoardActivityDeleteList(state, action);
    case actionTypes.ADD_COMMENT: return addComment(state, action);
    case actionTypes.UPDATE_COMMENT: return updateComment(state, action);
    case actionTypes.DELETE_COMMENT: return deleteComment(state, action);
    case actionTypes.SET_LOADING_ALL_BOARD_ACTIVITY: return { ...state, allBoardActivityLoading: action.bool };
    case actionTypes.SET_ERR_ALL_BOARD_ACTIVITY: return { ...state, allBoardActivityErr: action.bool };
    case actionTypes.SET_ALL_BOARD_ACTIVITY_FIRST_PAGE: return { ...state, allBoardActivity: action.activity };
    case actionTypes.SET_ALL_BOARD_ACTIVITY: return { ...state, allBoardActivity: state.allBoardActivity.concat(action.activity) };
    case actionTypes.SET_ALL_BOARD_ACTIVITY_SHOWN: return { ...state, allBoardActivityShown: true };
    case actionTypes.RESET_ALL_BOARD_ACTIVITY: return resetAllBoardActivity(state, action);
    case actionTypes.LEAVE_BOARD: return { ...initialState };
    case actionTypes.LOGOUT: return { ...initialState };
    default: return state;
  }
};

const resetCardActivity = (state, action) => ({
  ...state,
  cardActivity: [],
  cardActivityLoading: false,
  shownCardActivityID: ''
});

const setCardActivity = (state, action) => {
  return { ...state, cardActivity: action.activity, shownCardActivityID: action.cardID };
};

const deleteBoardActivity = (state, action) => {
  const boardActivity = state.boardActivity.filter(activity => activity.commentID);
  let cardActivity = state.cardActivity;
  let allBoardActivity = state.allBoardActivity;
  if (state.shownCardActivityID !== '') {
    cardActivity = cardActivity.filter(activity => activity.commentID);
  }
  if (state.allBoardActivityShown) {
    allBoardActivity = allBoardActivity.filter(activity => activity.commentID);
  }
  return { ...state, boardActivity, allBoardActivity, cardActivity };
};

const addRecentActivity = (state, action) => {
  const boardActivity = [...state.boardActivity];
  boardActivity.unshift(action.newActivity);
  if (boardActivity.length > 20) { boardActivity.pop(); }
  let allBoardActivity = state.allBoardActivity;
  if (checkBoardActivity(state)) {
    allBoardActivity = [...allBoardActivity];
    allBoardActivity.unshift(action.newActivity);
  }
  let cardActivity = state.cardActivity;
  if (action.newActivity.cardID === state.shownCardActivityID) {
    cardActivity = [...cardActivity];
    cardActivity.unshift(action.newActivity);
  }
  return { ...state, boardActivity, allBoardActivity, cardActivity };
};

const moveCardDiffList = (state, action) => {
  // update listID for card's activities in boardActivity
  const boardActivity = updateActivityListID([...state.boardActivity], action.sourceID, action.destID);
  const allComments = updateActivityListID([...state.allComments], action.sourceID, action.destID);
  if (checkBoardActivity(state)) {
    const allBoardActivity = updateActivityListID([...state.allBoardActivity], action.sourceID, action.destID);
    return { ...state, boardActivity, allComments, allBoardActivity };
  }
  return { ...state, boardActivity, allComments };
};

const setBoardActivity = (state, action) => ({
  ...state,
  boardActivity: action.payload.activity,
  allComments: action.payload.allComments
});

const updateBoardActivityDeleteCard = (state, action) => {
  const allComments = state.allComments.filter(comment => comment.cardID !== action.cardID);
  let allBoardActivity = state.allBoardActivity;
  if (checkBoardActivity(state)) {
    allBoardActivity = state.allBoardActivity.filter(activity => activity.cardID !== action.cardID);
  }
  return { ...state, boardActivity: action.activity, allComments, allBoardActivity };
};

const updateBoardActivityDeleteList = (state, action) => {
  const allComments = state.allComments.filter(comment => comment.listID !== action.listID);
  if (checkBoardActivity(state)) {
    const allBoardActivity = state.allBoardActivity.filter(activity => activity.listID !== action.listID);
    return { ...state, boardActivity: action.activity, allComments, allBoardActivity };
  }
  return { ...state, boardActivity: action.activity, allComments };
};

const addComment = (state, action) => {
  const allComments = [...state.allComments];
  const comment = { ...action.payload, cardTitle: action.cardTitle };
  allComments.unshift(comment);
  const boardActivity = [...state.boardActivity];
  boardActivity.unshift(comment);
  let allBoardActivity = state.allBoardActivity;
  if (checkBoardActivity(state)) {
    allBoardActivity = [...allBoardActivity];
    allBoardActivity.unshift(comment);
  }
  let cardActivity = state.cardActivity;
  if (state.shownCardActivityID === action.payload.cardID) {
    cardActivity = [...cardActivity];
    cardActivity.unshift(comment);
  }
  return { ...state, allComments, boardActivity, allBoardActivity, cardActivity };
};

const updateComment = (state, action) => {
  const allComments = [...state.allComments];
  const commentIndex = allComments.findIndex(comment => comment.commentID === action.commentID);
  const comment = { ...allComments[commentIndex] };
  comment.msg = action.msg;
  allComments[commentIndex] = comment;
  const activityIndex = state.boardActivity.findIndex(activity => activity.commentID === action.commentID);
  let boardActivity = state.boardActivity;
  if (activityIndex !== -1) {
    boardActivity = [...boardActivity];
    boardActivity[activityIndex] = comment;
  }
  let cardActivity = state.cardActivity;
  if (state.shownCardActivityID === action.cardID) {
    cardActivity = [...cardActivity];
    const cardActivityIndex = cardActivity.findIndex(activity => activity.commentID === action.commentID);
    if (cardActivityIndex !== -1) { cardActivity[cardActivityIndex] = comment; }
  }
  return { ...state, allComments, boardActivity, cardActivity };
};

const deleteComment = (state, action) => {
  const allComments = [...state.allComments];
  const allCommentIndex = allComments.findIndex(comment => comment.commentID === action.commentID);
  allComments.splice(allCommentIndex, 1);
  let cardActivity = state.cardActivity;
  if (state.shownCardActivityID === action.cardID) {
    cardActivity = [...cardActivity];
    const cardActivityIndex = cardActivity.findIndex(activity => activity.commentID === action.commentID);
    if (cardActivityIndex !== -1) { cardActivity.splice(cardActivityIndex, 1); }
  }
  const activityIndex = state.boardActivity.findIndex(activity => activity.commentID === action.commentID);
  let boardActivity = state.boardActivity;
  if (activityIndex !== -1) {
    boardActivity = [...boardActivity];
    boardActivity.splice(activityIndex, 1);
  }
  return { ...state, allComments, cardActivity, boardActivity };
};

const resetAllBoardActivity = (state, action) => ({
  ...state,
  allBoardActivityLoading: false,
  allBoardActivityErr: false,
  allBoardActivityShown: false
});

export default reducer;
