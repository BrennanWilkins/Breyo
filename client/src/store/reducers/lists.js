import * as actionTypes from '../actions/actionTypes';
const Entities = require('entities');

const initialState = {
  lists: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_ACTIVE_BOARD: {
      const lists = action.payload.lists.map(list => ({ ...list, title: Entities.decode(list.title) }))
      .sort((a,b) => a.indexInBoard - b.indexInBoard);
      return { ...state, lists };
    }
    case actionTypes.UPDATE_LIST_TITLE: {
      const lists = [...state.lists];
      const index = lists.findIndex(list => list.listID === action.listID);
      lists[index] = { ...lists[index], title: action.title };
      return { ...state, lists };
    }
    case actionTypes.ADD_LIST: {
      const list = { listID: action.listID, title: action.title, cards: [], indexInBoard: state.lists.length };
      const lists = [...state.lists];
      lists.push(list);
      return { ...state, lists };
    }
    default: return state;
  }
};

export default reducer;
