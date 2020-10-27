import React, { useState } from 'react';
import classes from './AuthPages.module.css';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = e => {
    e.preventDefault();
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
          <button type="submit">Sign Up</button>
        </form>
        <div className={classes.Links}>
          <div className={classes.Link}>Already have an account? <Link to="/login">Log in</Link></div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
