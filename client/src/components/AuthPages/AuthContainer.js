import React from 'react';
import classes from './AuthPages.module.css';
import { completedTasks, placeholders } from '../UI/illustrations';

const AuthContainer = props => (
  <div>
    {props.children}
    <div className={classes.Illustrations}>
      <div>{completedTasks}</div>
      <div>{placeholders}</div>
    </div>
  </div>
);

export default AuthContainer;
