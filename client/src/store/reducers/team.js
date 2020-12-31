import * as actionTypes from '../actions/actionTypes';

const initialState = {
  teamID: '',
  url: '',
  desc: '',
  members: [],
  title: '',
  logo: '',
  boards: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default: return state;
  }
};

export default reducer;
