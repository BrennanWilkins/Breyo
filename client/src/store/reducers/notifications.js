import * as actionTypes from '../actions/actionTypes';

const initialState = {
  notifs: []
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.SET_NOTIFS: return {
      ...state,
      notifs: action.notifs
    };
    case actionTypes.DELETE_NOTIF: return {
      ...state,
      notifs: state.notifs.filter(notif => notif.id !== action.id)
    };
    case actionTypes.LOGOUT: return { ...initialState };
    default: return state;
  }
};

export default reducer;
