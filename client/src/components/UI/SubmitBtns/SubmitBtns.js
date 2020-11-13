import React from 'react';
import classes from './SubmitBtns.module.css';
import { CloseBtn } from '../Buttons/Buttons';

const SubmitBtns = props => (
  <div className={classes.Btns}>
    <span className={classes.SubmitBtn}><button type="submit" disabled={props.disabled}>{props.text}</button></span>
    <span className={classes.CloseBtn}><CloseBtn close={props.close} /></span>
  </div>
);

export default SubmitBtns;
