import React from 'react';
import classes from './NavBtns.module.css';
import { Link } from 'react-router-dom';

export const LoginBtn = () => (
  <Link to="/login"><button className={classes.LoginBtn}>Login</button></Link>
);

export const SignupBtn = () => (
  <Link to="/signup"><button className={classes.SignupBtn}>Sign up</button></Link>
);

export const BackBtn = () => (
  <Link to="/"><button className={classes.BackBtn}>Back to my boards</button></Link>
);

export const NavBtn = props => (
  <Link to={props.link}><button className={classes.NavBtn}>{props.title}</button></Link>
);
