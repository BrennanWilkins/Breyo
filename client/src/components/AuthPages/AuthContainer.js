import React from 'react';
import classes from './AuthPages.module.css';
import { completedTasks, placeholders } from '../UI/illustrations';
import LogoTitle from '../UI/LogoTitle/LogoTitle';

const AuthContainer = props => (
  <div>
    <div className={classes.Title}><LogoTitle home /></div>
    {props.children}
    <div className={classes.Illustrations}>
      <div>{completedTasks}</div>
      <div>{placeholders}</div>
    </div>
  </div>
);

export default AuthContainer;
