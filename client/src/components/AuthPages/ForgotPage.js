import React, { useState } from 'react';
import classes from './AuthPages.module.css';
import { Link } from 'react-router-dom';
import AuthContainer from './AuthContainer';

const ForgotPage = () => {
  const [email, setEmail] = useState('');

  const submitHandler = e => {
    e.preventDefault();
  };

  return (
    <AuthContainer>
      <h1 className={classes.Title}><Link to="/">Brello</Link></h1>
      <div className={classes.LoginPanel} style={{ height: '350px'}}>
        <h3 className={classes.Title3}>Forgot your password?</h3>
        <p className={classes.SubTitle}>Please enter your email and check your inbox for a link to reset your password.</p>
        <form onSubmit={submitHandler} className={classes.Form}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <button type="submit">Reset my password</button>
        </form>
        <div className={classes.Links}>
          <div className={classes.Link}><Link to="/login">Back to login</Link></div>
        </div>
      </div>
    </AuthContainer>
  );
};

export default ForgotPage;
