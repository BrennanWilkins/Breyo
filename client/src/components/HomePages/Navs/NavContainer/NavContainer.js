import React from 'react';
import classes from './NavContainer.module.css';
import PropTypes from 'prop-types';

const NavContainer = props => (
  <>
    {props.showDropdown && <div className={classes.Backdrop} onClick={props.closeDropdown}></div>}
    <div className={classes.NavBar}>
      {props.children}
    </div>
  </>
);

NavContainer.propTypes = {
  showDropdown: PropTypes.bool.isRequired,
  closeDropdown: PropTypes.func.isRequired,
  children: PropTypes.array
};

export default NavContainer;
