import * as actionTypes from '../actions/actionTypes';
import { startOfMonth, endOfMonth } from 'date-fns';

const initialState = {
  roadmapMode: 'List',
  dateRange: {
    type: 'Month',
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date())
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ROADMAP_DATE_RANGE: return { ...state, dateRange: action.dateRange };
    case actionTypes.SET_ROADMAP_MODE: return { ...state, roadmapMode: action.mode };
    case actionTypes.LOGOUT: return { ...initialState };
    case actionTypes.RESET_ROADMAP_SETTINGS: return { ...initialState };
    default: return state;
  }
};

export default reducer;
