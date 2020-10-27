import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isAuth: false,
  fullName: '',
  email: '',
  invites: [],
  boards: [],
  loginLoading: false,
  loginErr: false,
  loginErrMsg: '',
  signupLoading: false,
  signupErr: false,
  signupErrMsg: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return {
      ...state,
      isAuth: true,
      fullName: action.payload.fullName,
      email: action.payload.email,
      invites: action.payload.invites,
      boards: action.payload.boards,
      loginLoading: false,
      loginErr: false,
      loginErrMsg: '',
      signupLoading: false,
      signupErr: false,
      signupErrMsg: ''
    };
    case actionTypes.LOGIN_LOADING: return {
      ...state,
      loginLoading: true,
      loginErr: false,
      loginErrMsg: ''
    };
    case actionTypes.SIGNUP_LOADING: return {
      ...state,
      signupLoading: true,
      signupErr: false,
      signupErrMsg: ''
    };
    case actionTypes.LOGIN_ERR: return {
      ...state,
      loginLoading: false,
      loginErr: true,
      loginErrMsg: action.msg
    };
    case actionTypes.SIGNUP_ERR: return {
      ...state,
      signupLoading: false,
      signupErr: true,
      signupErrMsg: action.msg
    };
    case actionTypes.AUTH_RESET: return { ...initialState };
    case actionTypes.LOGOUT: return { ...initialState };
    default: return state;
  }
};

export default reducer;