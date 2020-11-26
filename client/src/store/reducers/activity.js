import * as actionTypes from '../actions/actionTypes';
import { concatSort, checkBoardActivity, updateActivityListID } from './reducerUtils';

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
    case actionTypes.RESET_CARD_ACTIVITY: return {
      ...state,
      cardActivity: [],
      cardActivityLoading: false,
      shownCardActivityID: ''
    };
    case actionTypes.SET_CARD_ACTIVITY: {
      const allComments = state.allComments.filter(comment => comment.cardID === action.cardID);
      const cardActivity = concatSort(action.activity, allComments);
      return { ...state, cardActivity, shownCardActivityID: action.cardID };
    }
    case actionTypes.CARD_ACTIVITY_LOADING : return { ...state, cardActivityLoading: action.bool };
    case actionTypes.SET_SHOWN_MEMBER_ACTIVITY: return { ...state, shownMemberActivity: action.member };
    case actionTypes.DELETE_BOARD_ACTIVITY: {
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
    }
    case actionTypes.ADD_RECENT_ACTIVITY: {
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
    }
    case actionTypes.MOVE_CARD_DIFF_LIST: {
      // update listID for card's activities in boardActivity
      const boardActivity = updateActivityListID([...state.boardActivity], action.sourceID, action.destID);
      const allComments = updateActivityListID([...state.allComments], action.sourceID, action.destID);
      if (checkBoardActivity(state)) {
        const allBoardActivity = updateActivityListID([...state.allBoardActivity], action.sourceID, action.destID);
        return { ...state, boardActivity, allComments, allBoardActivity };
      }
      return { ...state, boardActivity, allComments };
    }
    case actionTypes.SET_BOARD_ACTIVITY: return { ...state, boardActivity: action.payload.activity, allComments: action.payload.allComments };
    case actionTypes.UPDATE_BOARD_ACTIVITY_DELETE_CARD: {
      const allComments = state.allComments.filter(comment => comment.cardID !== action.cardID);
      const combinedActivity = concatSort(action.activity, allComments).slice(0, 20);
      let allBoardActivity = state.allBoardActivity;
      if (checkBoardActivity(state)) {
        allBoardActivity = state.allBoardActivity.filter(activity => activity.cardID !== action.cardID);
      }
      return { ...state, boardActivity: combinedActivity, allComments, allBoardActivity };
    }
    case actionTypes.UPDATE_BOARD_ACTIVITY_DELETE_LIST: {
      const allComments = state.allComments.filter(comment => comment.listID !== action.listID);
      const combinedActivity = concatSort(action.activity, allComments).slice(0, 20);
      if (checkBoardActivity(state)) {
        const allBoardActivity = state.allBoardActivity.filter(activity => activity.listID !== action.listID);
        return { ...state, boardActivity: combinedActivity, allComments, allBoardActivity };
      }
      return { ...state, boardActivity: combinedActivity, allComments };
    }
    case actionTypes.ADD_COMMENT: {
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
    }
    case actionTypes.UPDATE_COMMENT: {
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
        return { ...state, allComments, boardActivity };
      }
      let cardActivity = state.cardActivity;
      if (state.shownCardActivityID === action.cardID) {
        cardActivity = [...cardActivity];
        const cardActivityIndex = cardActivity.findIndex(activity => activity.commentID === action.commentID);
        if (cardActivityIndex !== -1) { cardActivity[cardActivityIndex] = comment; }
      }
      return { ...state, allComments, boardActivity, cardActivity };
    }
    case actionTypes.DELETE_COMMENT: {
      const allComments = [...state.allComments];
      const allCommentIndex = allComments.findIndex(comment => comment.commentID === action.commentID);
      allComments.splice(allCommentIndex, 1);
      let cardActivity = state.cardActivity;
      if (state.shownCardActivityID === action.cardID) {
        cardActivity = [...cardActivity];
        const cardActivityIndex = cardActivity.findIndex(activity => activity.commentID === action.commentID);
        if (cardActivityIndex !== -1) { cardActivity.splice(cardActivityIndex, 1); }
      }
      return { ...state, allComments, cardActivity };
    }
    case actionTypes.SET_LOADING_ALL_BOARD_ACTIVITY: return { ...state, allBoardActivityLoading: action.bool };
    case actionTypes.SET_ERR_ALL_BOARD_ACTIVITY: return { ...state, allBoardActivityErr: action.bool };
    case actionTypes.SET_ALL_BOARD_ACTIVITY_FIRST_PAGE: {
      const allBoardActivity = concatSort(action.activity, state.allComments).slice(0, 100);
      return { ...state, allBoardActivity };
    }
    case actionTypes.SET_ALL_BOARD_ACTIVITY: {
      const allBoardActivity = concatSort(action.activity, state.allComments);
      return { ...state, allBoardActivity };
    }
    case actionTypes.SET_ALL_BOARD_ACTIVITY_SHOWN: return { ...state, allBoardActivityShown: true };
    case actionTypes.RESET_ALL_BOARD_ACTIVITY: return {
      ...state,
      allBoardActivityLoading: false,
      allBoardActivityErr: false,
      allBoardActivityShown: false
    };
    case actionTypes.LEAVE_BOARD: return { ...initialState };
    default: return state;
  }
};

export default reducer;
