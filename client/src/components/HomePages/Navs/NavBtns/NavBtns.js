import React from 'react';
import classes from './NavBtns.module.css';

export const LoginBtn = () => (
  <button className={classes.LoginBtn}>Login</button>
);

export const SignupBtn = () => (
  <button className={classes.SignupBtn}>Sign up</button>
);

export const BackBtn = () => (
  <button className={classes.BackBtn}>Back to my boards</button>
);
