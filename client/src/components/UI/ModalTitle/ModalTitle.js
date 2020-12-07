import React from 'react';
import classes from './ModalTitle.module.css';
import PropTypes from 'prop-types';
import { CloseBtn } from '../Buttons/Buttons';

const ModalTitle = props => (
  <div className={props.light ? classes.LightTitle : props.lighter ? classes.LighterTitle : classes.Title}>
    {props.title}
    <span className={classes.CloseBtn}><CloseBtn close={props.close} /></span>
  </div>
);

ModalTitle.propTypes = {
  title: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  lighter: PropTypes.bool,
  light: PropTypes.bool
};

export default ModalTitle;
