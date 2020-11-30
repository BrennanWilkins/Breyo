import React, { useState } from 'react';
import classes from './HomeNav.module.css';
import { Link } from 'react-router-dom';
import LogoTitle from '../../../UI/LogoTitle/LogoTitle';
import DropdownToggle from '../../../UI/DropdownToggle/DropdownToggle';
import Dropdown from '../../../UI/Dropdown/Dropdown';
import NavContainer from '../NavContainer/NavContainer';

const HomeNav = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const links = (
    <>
      <Link to="/tech"><button>Tech</button></Link>
      <Link to="/help"><button>Help</button></Link>
      <Link to="/login"><button className={classes.LoginBtn}>Login</button></Link>
    </>
  );

  return (
    <NavContainer showDropdown={showDropdown} closeDropdown={() => setShowDropdown(false)}>
      <div className={classes.NavBarContent}>
        <LogoTitle home />
        <div className={classes.NavBtns}>
          {links}
          <DropdownToggle open={showDropdown} clicked={() => setShowDropdown(shown => !shown)} />
        </div>
      </div>
      <Dropdown show={showDropdown} close={() => setShowDropdown(false)}>
        <div className={classes.DropdownBtns}>
          {links}
          <Link to="/signup"><button className={classes.SignupBtn}>Sign up</button></Link>
        </div>
      </Dropdown>
    </NavContainer>
  );
};

export default HomeNav;
