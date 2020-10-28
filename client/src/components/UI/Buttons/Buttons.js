import React from 'react';
import classes from './Buttons.module.css';
import { xIcon } from '../icons';

const Button = props => (
  <button className={classes.Button} onClick={props.clicked} disabled={props.disabled}>{props.children}</button>
);

export const AccountBtn = props => (
  <button className={classes.AccountBtn} onClick={props.clicked}>{props.children}</button>
);

export const CloseBtn = props => (
  <button style={{color: props.color}} className={classes.CloseBtn} onClick={props.close}>{xIcon}</button>
);

export default Button;
