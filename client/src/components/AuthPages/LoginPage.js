import React, { useState, useEffect } from 'react';
import classes from './AuthPages.module.css';
import { Link } from 'react-router-dom';
import AuthSpinner from '../UI/AuthSpinner/AuthSpinner';
import { loginValidation } from '../../utils/authValidation';
import { connect } from 'react-redux';
import { login, loginErr, authReset } from '../../store/actions';

const LoginPage = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => props.authReset(), []);

  const submitHandler = e => {
    e.preventDefault();
    let msg = loginValidation(email, password);
    if (msg !== '') { return props.loginErr(msg); }
    props.login(email, password);
  };

  return (
    <div className={classes.Container}>
      <h1 className={classes.Title}><Link to="/">Brello</Link></h1>
      <div className={classes.Panel}>
        <h3>Log in to Brello</h3>
        <form onSubmit={submitHandler} className={classes.Form}>
          <input placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Enter your password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" disabled={props.loading}>Log in</button>
        </form>
        {props.loading && <AuthSpinner />}
        <div className={props.err ? classes.ShowErr : classes.HideErr}>{props.errMsg}</div>
        <div className={classes.Links}>
          <div className={classes.Link}><Link to="/forgot-password">Forgot my password</Link></div>
          <div className={classes.Link}>Don't have an account? <Link to="/signup">Sign up</Link></div>
        </div>
      </div>
    </div>
  );
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