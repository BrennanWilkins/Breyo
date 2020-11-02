import React from 'react';
import classes from './Inputs.module.css';
import { checkIcon } from '../icons';

export const Checkbox = props => (
  <div className={props.checked ? classes.CheckboxCheck : classes.Checkbox} onClick={props.clicked}>{checkIcon}</div>
);
