import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isAuth: false,
  loginLoading: false,
  loginErr: false,
  loginErrMsg: '',
  signupLoading: false,
  signupErr: false,
  signupErrMsg: '',
  autoLoginLoading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN: return login(state, action);
    case actionTypes.LOGIN_LOADING: return loginLoading(state, action);
    case actionTypes.SIGNUP_LOADING: return signupLoading(state, action);
    case actionTypes.LOGIN_ERR: return loginErr(state, action);
    case actionTypes.SIGNUP_ERR: return signupErr(state, action);
    case actionTypes.AUTH_RESET: return { ...initialState };
    case actionTypes.LOGOUT: return { ...initialState };
    case actionTypes.AUTO_LOGIN_LOADING: return { ...state, autoLoginLoading: action.bool };
    default: return state;
  }
};

const login = (state, action) => ({
  ...state,
  isAuth: true,
  loginLoading: false,
  loginErr: false,
  loginErrMsg: '',
  signupLoading: false,
  signupErr: false,
  signupErrMsg: ''
});

const loginLoading = (state, action) => ({
  ...state,
  loginLoading: true,
  loginErr: false,
  loginErrMsg: ''
});

const signupLoading = (state, action) => ({
  ...state,
  signupLoading: true,
  signupErr: false,
  signupErrMsg: ''
});

const loginErr = (state, action) => ({
  ...state,
  loginLoading: false,
  loginErr: true,
  loginErrMsg: action.msg
});

const signupErr = (state, action) => ({
  ...state,
  signupLoading: false,
  signupErr: true,
  signupErrMsg: action.msg
});

export default reducer;
