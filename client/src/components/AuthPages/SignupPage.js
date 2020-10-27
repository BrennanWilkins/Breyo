import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './AuthPages.module.css';
import { Link } from 'react-router-dom';
import { signupValidation } from '../../utils/authValidation';
import AuthSpinner from '../UI/AuthSpinner/AuthSpinner';
import { connect } from 'react-redux';
import { signup, signupErr, authReset } from '../../store/actions';

const SignupPage = props => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => props.authReset(), []);

  const submitHandler = e => {
    e.preventDefault();
    let msg = signupValidation(email, fullName, password, confirmPassword);
    if (msg !== '') { return props.signupErr(msg); }
    props.signup({ email, fullName, password, confirmPassword });
  };

  return (
    <div className={classes.Container}>
      <h1 className={classes.Title}><Link to="/">Brello</Link></h1>
      <div className={classes.Panel}>
        <h3>Sign up for Brello</h3>
        <form onSubmit={submitHandler} className={classes.Form}>
          <input placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Enter your full name" value={fullName} onChange={e => setFullName(e.target.value)} />
          <input placeholder="Enter your password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {password !== '' &&
          <input className={classes.FadeInInput} placeholder="Confirm your password"
          type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />}
          <button type="submit" disabled={props.loading}>Sign Up</button>
        </form>
        {props.loading && <AuthSpinner />}
        <div className={props.err ? classes.ShowErr : classes.HideErr}>{props.errMsg}</div>
        <div className={classes.Links}>
          <div className={classes.Link}>Already have an account? <Link to="/login">Log in</Link></div>
        </div>
      </div>
    </div>
  );
};

SignupPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  err: PropTypes.bool.isRequired,
  errMsg: PropTypes.string.isRequired,
  signup: PropTypes.func.isRequired,
  signupErr: PropTypes.func.isRequired,
  authReset: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loading: state.auth.signupLoading,
  err: state.auth.signupErr,
  errMsg: state.auth.signupErrMsg
});

const mapDispatchToProps = dispatch => ({
  signup: payload => dispatch(signup(payload)),
  signupErr: msg => dispatch(signupErr(msg)),
  authReset: () => dispatch(authReset())
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
