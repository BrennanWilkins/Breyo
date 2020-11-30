import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './AuthPages.module.css';
import { Link } from 'react-router-dom';
import AuthSpinner from '../UI/AuthSpinner/AuthSpinner';
import { loginValidation } from '../../utils/authValidation';
import { connect } from 'react-redux';
import { login, loginErr, authReset } from '../../store/actions';
import AuthContainer from './AuthContainer';

const LoginPage = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErr, setShowErr] = useState(true);

  useEffect(() => setShowErr(false), [email, password]);

  useEffect(() => props.authReset(), []);

  const submitHandler = e => {
    e.preventDefault();
    setShowErr(true);
    // message will be empty if no errors
    let msg = loginValidation(email, password);
    if (msg !== '') { return props.loginErr(msg); }
    props.login(email, password);
  };

  return (
    <AuthContainer>
      <div className={classes.LoginPanel}>
        <h3 className={classes.Title3}>Log in to Breyo</h3>
        <form onSubmit={submitHandler} className={classes.Form}>
          <input disabled={props.loading} placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
          <input disabled={props.loading} placeholder="Enter your password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" disabled={props.loading}>Log in</button>
        </form>
        {props.loading && <AuthSpinner />}
        <div className={(props.err && showErr) ? classes.ShowErr : classes.HideErr}>{props.errMsg}</div>
        <div className={classes.Links}>
          <div className={classes.Link}><Link to="/forgot-password">Forgot my password</Link></div>
          <div className={classes.Link}>Don't have an account? <Link to="/signup">Sign up</Link></div>
        </div>
      </div>
    </AuthContainer>
  );
};

LoginPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  err: PropTypes.bool.isRequired,
  errMsg: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
  loginErr: PropTypes.func.isRequired,
  authReset: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loading: state.auth.loginLoading,
  err: state.auth.loginErr,
  errMsg: state.auth.loginErrMsg
});

const mapDispatchToProps = dispatch => ({
  login: (email, password) => dispatch(login(email, password)),
  loginErr: msg => dispatch(loginErr(msg)),
  authReset: () => dispatch(authReset())
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
