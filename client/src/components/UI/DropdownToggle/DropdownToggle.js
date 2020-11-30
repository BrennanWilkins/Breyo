import React from 'react';
import classes from './DropdownToggle.module.css';
import PropTypes from 'prop-types';

const DropdownToggle = props => {
  const className = `${classes.DropdownToggle} ${props.open ? classes.Open : ''}
  ${props.widthToShow === 480 ? classes.OpenSmall : props.widthToShow === 540 ? classes.OpenMid : classes.OpenBig}`;

  return (
    <div className={className} onClick={props.clicked}>
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
