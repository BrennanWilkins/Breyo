import React from 'react';
import classes from './DropdownToggle.module.css';
import PropTypes from 'prop-types';

const DropdownToggle = props => {
  return (
    <div className={`${classes.DropdownToggle} ${props.open ? classes.Open : ''} ${props.widthToShow === 480 ? classes.OpenSmall : classes.OpenBig}`} onClick={props.clicked}>
      <div></div>
    </div>
  );
};

DropdownToggle.propTypes = {
  clicked: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  widthToShow: PropTypes.number.isRequired
};

export default DropdownToggle;
