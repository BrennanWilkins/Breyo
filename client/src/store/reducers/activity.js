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
    default: return state;
  }
};

export default reducer;
