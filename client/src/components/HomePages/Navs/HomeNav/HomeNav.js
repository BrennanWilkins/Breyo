import React, { useState } from 'react';
import classes from './HomeNav.module.css';
import LogoTitle from '../../../UI/LogoTitle/LogoTitle';
import DropdownToggle from '../../../UI/DropdownToggle/DropdownToggle';
import Dropdown from '../../../UI/Dropdown/Dropdown';
import NavContainer from '../NavContainer/NavContainer';
import { LoginBtn, SignupBtn, NavBtn } from '../NavBtns/NavBtns';

const HomeNav = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const links = (
    <>
      <NavBtn link="/tech" title="Tech" />
      <NavBtn link="/help" title="Help" />
      <span className={classes.LoginBtn}><LoginBtn /></span>
    </>
  );

  return (
    <NavContainer showDropdown={showDropdown} closeDropdown={() => setShowDropdown(false)}>
      <div className={classes.NavBarContent}>
        <LogoTitle home />
        <div className={classes.NavBtns}>
          {links}
          <DropdownToggle widthToShow={480} open={showDropdown} clicked={() => setShowDropdown(shown => !shown)} />
        </div>
      </div>
      <Dropdown show={showDropdown} close={() => setShowDropdown(false)} max={480}>
        <div className={classes.DropdownBtns}>
          {links}
          <SignupBtn />
        </div>
      </Dropdown>
    </NavContainer>
  );
};

export default HomeNav;
