import React, { useState } from 'react';
import classes from './HomeNav.module.css';
import LogoTitle from '../../../UI/LogoTitle/LogoTitle';
import DropdownToggle from '../../../UI/DropdownToggle/DropdownToggle';
import Dropdown from '../../../UI/Dropdown/Dropdown';
import NavContainer from '../NavContainer/NavContainer';
import { LoginBtn, SignupBtn, NavBtn } from '../NavBtns/NavBtns';

const HomeNav = props => {
  const [showDropdown, setShowDropdown] = useState(false);

  const links = (
    <>
      <NavBtn link="/help" title="Help" />
      <span className={classes.LoginBtn}><LoginBtn /></span>
      {props.tech && <SignupBtn />}
    </>
  );

  return (
    <NavContainer showDropdown={showDropdown} closeDropdown={() => setShowDropdown(false)}>
      <div className={classes.NavBarContent}>
        <LogoTitle home={!props.tech} tech={props.tech} />
        <div className={props.tech ? `${classes.NavBtns} ${classes.NavBtnsTech}` : classes.NavBtns}>
          {links}
          <DropdownToggle widthToShow={props.tech ? 540 : 480} open={showDropdown} clicked={() => setShowDropdown(shown => !shown)} />
        </div>
      </div>
      <Dropdown show={showDropdown} close={() => setShowDropdown(false)} max={props.tech ? 540 : 480}>
        <div className={props.tech ? `${classes.DropdownBtns} ${classes.DropdownBtnsTech}` : classes.DropdownBtns}>
          {links}
          {!props.tech && <SignupBtn />}
        </div>
      </Dropdown>
    </NavContainer>
  );
};

export default HomeNav;
