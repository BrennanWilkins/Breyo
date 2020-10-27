import React, { useState } from 'react';
import classes from './AuthPages.module.css';
import { Link } from 'react-router-dom';
import AuthSpinner from '../UI/AuthSpinner/AuthSpinner';
import { loginValidation } from '../../utils/authValidation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = e => {
    e.preventDefault();
    let msg = loginValidation(email, password);
    if (msg !== '') { setErr(true); return setErrMsg(msg); }
    setLoading(true);
    setErr(false);
  };

  return (
    <div className={classes.Container}>
      <h1 className={classes.Title}><Link to="/">Brello</Link></h1>
      <div className={classes.Panel}>
        <h3>Log in to Brello</h3>
        <form onSubmit={submitHandler} className={classes.Form}>
          <input placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Enter your password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit">Log in</button>
        </form>
        {loading && <AuthSpinner />}
        <div className={err ? classes.ShowErr : classes.HideErr}>{errMsg}</div>
        <div className={classes.Links}>
          <div className={classes.Link}><Link to="/forgot-password">Forgot my password</Link></div>
          <div className={classes.Link}>Don't have an account? <Link to="/signup">Sign up</Link></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
