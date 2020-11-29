import React from 'react';
import classes from './DropdownToggle.module.css';
import PropTypes from 'prop-types';

const DropdownToggle = props => {
  return (
    <div className={`${classes.DropdownToggle} ${props.open ? classes.Open : ''}`} onClick={props.clicked}>
      <div></div>
    </div>
  );
};

DropdownToggle.propTypes = {
  clicked: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default DropdownToggle;
