import React from 'react';
import classes from './SubmitBtns.module.css';
import { CloseBtn } from '../Buttons/Buttons';
import PropTypes from 'prop-types';

const SubmitBtns = props => (
  <div className={classes.Btns}>
    <span className={classes.SubmitBtn}><button type="submit" disabled={props.disabled}>{props.text}</button></span>
    <CloseBtn className={classes.CloseBtn} close={props.close} />
  </div>
);

SubmitBtns.propTypes = {
  disabled: PropTypes.bool,
  text: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
};

export default SubmitBtns;
