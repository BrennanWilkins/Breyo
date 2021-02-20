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

// checks if an action can be done if all board activity shown, it is not currently loading, & no errors
const checkBoardActivity = state => state.allBoardActivityShown && !state.allBoardActivityLoading && !state.allBoardActivityErr;

const resetCardActivity = (state, action) => ({
  ...state,
  cardActivity: [],
  cardActivityLoading: false,
  shownCardActivityID: ''
});

const setCardActivity = (state, action) => ({
  ...state,
  cardActivity: action.activity,
  shownCardActivityID: action.cardID
});

const deleteBoardActivity = (state, action) => {
  const boardActivity = state.boardActivity.filter(activity => activity.commentID);
  const cardActivity = state.shownCardActivityID ? state.cardActivity.filter(act => act.commentID) : state.cardActivity;
  const allBoardActivity = state.allBoardActivityShown ? state.allBoardActivity.filter(act => act.commentID) : state.allBoardActivity;
  return { ...state, boardActivity, allBoardActivity, cardActivity };
};

const addRecentActivity = (state, action) => {
  const boardActivity = [action.newActivity, ...state.boardActivity];
  if (boardActivity.length > 20) { boardActivity.pop(); }
  const allBoardActivity = checkBoardActivity(state) ? [action.newActivity, ...state.allBoardActivity] : state.allBoardActivity;
  const cardActivity = action.newActivity.cardID === state.shownCardActivityID ? [action.newActivity, ...state.cardActivity] : state.cardActivity;
  return { ...state, boardActivity, allBoardActivity, cardActivity };
};

const moveCardDiffList = (state, action) => {
  // update listID for card's activities in boardActivity
  const boardActivity = state.boardActivity.map(act => act.listID === action.sourceID ? { ...act, listID: action.destID } : act);
  const allComments = state.allComments.map(comment => comment.listID === action.sourceID ? { ...comment, listID: action.destID } : comment);
  const allBoardActivity = checkBoardActivity(state) ?
    state.allBoardActivity.map(act => act.listID === action.sourceID ? { ...act, listID: action.destID } : act) :
    state.allBoardActivity;
  return { ...state, boardActivity, allComments, allBoardActivity };
};

const setBoardActivity = (state, action) => ({
  ...state,
  boardActivity: action.payload.activity,
  allComments: action.payload.allComments
});

const updateBoardActivityDeleteCard = (state, action) => {
  const allComments = state.allComments.filter(comment => comment.cardID !== action.cardID);
  const allBoardActivity = checkBoardActivity(state) ? state.allBoardActivity.filter(act => act.cardID !== action.cardID) : state.allBoardActivity;
  return { ...state, boardActivity: action.activity, allComments, allBoardActivity };
};

const updateBoardActivityDeleteList = (state, action) => {
  const allComments = state.allComments.filter(comment => comment.listID !== action.listID);
  const allBoardActivity = checkBoardActivity(state) ? state.allBoardActivity.filter(act => act.listID !== action.listID) : state.allBoardActivity;
  return { ...state, boardActivity: action.activity, allComments, allBoardActivity };
};

const addComment = (state, action) => {
  const comment = { ...action.payload, cardTitle: action.cardTitle };
  const allComments = [comment, ...state.allComments];
  const boardActivity = [comment, ...state.boardActivity];
  const allBoardActivity = checkBoardActivity(state) ? [comment, ...state.allBoardActivity] : state.allBoardActivity;
  const cardActivity = state.shownCardActivityID === action.payload.cardID ? [comment, ...state.cardActivity] : state.cardActivity;
  return { ...state, allComments, boardActivity, allBoardActivity, cardActivity };
};

const updateComment = (state, action) => {
  const allComments = state.allComments.map(comment => comment.commentID === action.commentID ? { ...comment, msg: action.msg } : comment);
  const boardActivity = state.boardActivity.map(act => act.commentID === action.commentID ? { ...act, msg: action.msg } : act);
  const cardActivity = state.shownCardActivityID === action.cardID ?
    state.cardActivity.map(act => act.commentID === action.commentID ? { ...act, msg: action.msg } : act) :
    state.cardActivity;
  return { ...state, allComments, boardActivity, cardActivity };
};

const deleteComment = (state, action) => {
  const allComments = state.allComments.filter(({ commentID }) => commentID !== action.commentID);
  const cardActivity = state.shownCardActivityID === action.cardID ?
    state.cardActivity.filter(({ commentID }) => commentID !== action.commentID) :
    state.cardActivity;
  const boardActivity = state.boardActivity.filter(({ commentID }) => commentID !== action.commentID);
  return { ...state, allComments, cardActivity, boardActivity };
};

const resetAllBoardActivity = (state, action) => ({
  ...state,
  allBoardActivityLoading: false,
  allBoardActivityErr: false,
  allBoardActivityShown: false
});

export default reducer;
