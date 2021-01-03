import React, { useRef } from 'react';
import classes from './Inputs.module.css';
import { checkIcon, uploadIcon } from '../icons';

export const Checkbox = props => (
  <div className={props.checked ? classes.CheckboxCheck : classes.Checkbox} onClick={props.clicked}>{checkIcon}</div>
);

export const FileInput = props => {
  const fileInput = useRef();

  return (
    <div className={classes.FileBtn}>
      <input ref={fileInput} type="file" accept="image/*" tabIndex="-1" onChange={e => props.change(e.target.files[0])} />
      <div onClick={() => fileInput.current.click()}>{uploadIcon} {props.title}</div>
    </div>
  );
};
