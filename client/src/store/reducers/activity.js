import * as actionTypes from '../actions/actionTypes';

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
      const cardActivity = action.activity.concat(allComments).sort((a,b) => new Date(b.date) - new Date(a.date));
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
      if (state.allBoardActivityShown && !state.allBoardActivityLoading && !state.allBoardActivityErr) {
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
      const boardActivity = [...state.boardActivity];
      for (let i = 0; i < boardActivity.length; i++) {
        if (boardActivity[i].listID === action.sourceID) {
          const updatedActivity = { ...boardActivity[i], listID: action.destID };
          boardActivity[i] = updatedActivity;
        }
      }
      const allComments = [...state.allComments];
      for (let i = 0; i < allComments.length; i++) {
        if (allComments[i].listID === action.sourceID) {
          const updatedComment = { ...allComments[i], listID: action.destID };
          allComments[i] = updatedComment;
        }
      }
      if (state.allBoardActivityShown && !state.allBoardActivityLoading && !state.allBoardActivityErr) {
        const allBoardActivity = [...state.allBoardActivity];
        for (let i = 0; i < allBoardActivity.length; i++) {
          if (allBoardActivity[i].listID === action.sourceID) {
            const updatedActivity = { ...allBoardActivity[i], listID: action.destID };
            allBoardActivity[i] = updatedActivity;
          }
        }
        return { ...state, boardActivity, allComments, allBoardActivity };
      }
      return { ...state, boardActivity, allComments };
    }
    case actionTypes.SET_BOARD_ACTIVITY: return { ...state, boardActivity: action.payload.activity, allComments: action.payload.allComments };
    case actionTypes.UPDATE_BOARD_ACTIVITY_DELETE_CARD: {
      const allComments = state.allComments.filter(comment => comment.cardID !== action.cardID);
      const combinedActivity = action.activity.concat(allComments).sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 20);
      let allBoardActivity = state.allBoardActivity;
      if (state.allBoardActivityShown && !state.allBoardActivityLoading && !state.allBoardActivityErr) {
        allBoardActivity = state.allBoardActivity.filter(activity => activity.cardID !== action.cardID);
      }
      return { ...state, boardActivity: combinedActivity, allComments, allBoardActivity };
    }
    case actionTypes.UPDATE_BOARD_ACTIVITY_DELETE_LIST: {
      const allComments = state.allComments.filter(comment => comment.listID !== action.listID);
      const combinedActivity = action.activity.concat(allComments).sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 20);
      if (state.allBoardActivityShown && !state.allBoardActivityLoading && !state.allBoardActivityErr) {
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
      if (state.allBoardActivityShown && !state.allBoardActivityLoading && !state.allBoardActivityErr) {
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
      const allBoardActivity = action.activity.concat(state.allComments).sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 100);
      return { ...state, allBoardActivity };
    }
    case actionTypes.SET_ALL_BOARD_ACTIVITY: {
      const allBoardActivity = action.activity.concat(state.allComments).sort((a,b) => new Date(b.date) - new Date(a.date));
      return { ...state, allBoardActivity };
    }
    case actionTypes.SET_ALL_BOARD_ACTIVITY_SHOWN: return { ...state, allBoardActivityShown: true };
    case actionTypes.RESET_ALL_BOARD_ACTIVITY: return {
      ...state,
      allBoardActivityLoading: false,
      allBoardActivityErr: false,
      allBoardActivityShown: false
    };
    default: return state;
  }
};

export default reducer;
