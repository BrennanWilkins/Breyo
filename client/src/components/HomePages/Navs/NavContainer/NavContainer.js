import React from 'react';
import classes from './NavContainer.module.css';

const NavContainer = props => {
  return (
    <>
      {props.showDropdown && <div className={classes.Backdrop} onClick={props.closeDropdown}></div>}
      <div className={classes.NavBar}>
        {props.children}
      </div>
    </>
  );
};

export default NavContainer;
