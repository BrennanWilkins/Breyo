import * as actionTypes from '../actions/actionTypes';

const initialState = {
  boardActivity: [],
  cardActivity: [],
  cardActivityLoading: false,
  shownMemberActivity: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESET_CARD_ACTIVITY: return { ...state, cardActivity: [] };
    case actionTypes.UPDATE_CARD_ACTIVITY: {
      const cardActivity = state.cardActivity.concat(action.activity);
      return { ...state, cardActivity };
    }
    case actionTypes.CARD_ACTIVITY_LOADING : return { ...state, cardActivityLoading: action.bool };
    case actionTypes.UPDATE_BOARD_ACTIVITY: return { ...state, boardActivity: action.activity };
    case actionTypes.SET_SHOWN_MEMBER_ACTIVITY: return { ...state, shownMemberActivity: action.member };
    case actionTypes.DELETE_BOARD_ACTIVITY: return { ...state, boardActivity: [] };
    case actionTypes.SET_ALL_CARD_ACTIVITY: return { ...state, cardActivity: action.activity };
    case actionTypes.ADD_RECENT_ACTIVITY: {
      const boardActivity = [...state.boardActivity];
      boardActivity.unshift(action.newActivity);
      if (boardActivity.length > 20) { boardActivity.pop(); }
      return { ...state, boardActivity };
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
      return { ...state, boardActivity };
    }
    case actionTypes.DELETE_CARD: {
      const boardActivity = state.boardActivity.filter(activity => activity.cardID !== action.cardID);
      return { ...state, boardActivity };
    }
    case actionTypes.DELETE_LIST: {
      const boardActivity = state.boardActivity.filter(activity => activity.listID !== action.listID);
      return { ...state, boardActivity };
    }
    default: return state;
  }
};

export default reducer;
