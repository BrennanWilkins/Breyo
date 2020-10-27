import React, { useState } from 'react';
import classes from './AuthPages.module.css';
import { Link } from 'react-router-dom';
import { signupValidation } from '../../utils/authValidation';
import AuthSpinner from '../UI/AuthSpinner/AuthSpinner';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = e => {
    e.preventDefault();
    let msg = signupValidation(email, fullName, password, confirmPassword);
    if (msg !== '') { setErr(true); return setErrMsg(msg); }
    setLoading(true);
    setErr(false);
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
          <button type="submit" disabled={loading}>Sign Up</button>
        </form>
        {loading && <AuthSpinner />}
        <div className={err ? classes.ShowErr : classes.HideErr}>{errMsg}</div>
        <div className={classes.Links}>
          <div className={classes.Link}>Already have an account? <Link to="/login">Log in</Link></div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
