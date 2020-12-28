import React from 'react';
import classes from './Buttons.module.css';
import { xIcon, caretIcon, backIcon } from '../icons';

const Button = props => (
  <button className={classes.Button} onClick={props.clicked} disabled={props.disabled}>{props.children}</button>
);

export const AccountBtn = props => (
  <button className={props.avatar ? classes.AccountBtnImg : classes.AccountBtn} onClick={props.clicked} title={props.title}>
    {props.avatar ? <img src={props.avatar} alt="" /> : props.children}
  </button>
);

export const CloseBtn = props => (
  <button style={{color: props.color}} className={classes.CloseBtn} onClick={props.close}>{xIcon}</button>
);

export const CloseBtnCircle = props => (
  <button className={classes.CloseBtnCircle} onClick={props.close}>{xIcon}</button>
);

export const ExpandBtn = props => (
  <button className={props.expanded ? classes.ExpandBtn : classes.CollapseBtn} onClick={props.clicked}>{caretIcon}</button>
);

export const BackBtn = props => (
  <button className={classes.BackBtn} onClick={props.back}>{backIcon}</button>
);

export const ActionBtn = props => (
  <button className={classes.ActionBtn} onClick={props.clicked}>{props.children}</button>
);

export default Button;
