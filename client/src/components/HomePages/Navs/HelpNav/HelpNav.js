import React, { useState } from 'react';
import classes from './HelpNav.module.css';
import { Link } from 'react-router-dom';
import LogoTitle from '../../../UI/LogoTitle/LogoTitle';
import DropdownToggle from '../../../UI/DropdownToggle/DropdownToggle';
import Dropdown from '../../../UI/Dropdown/Dropdown';
import { connect } from 'react-redux';
import NavContainer from '../NavContainer/NavContainer';

const HelpNav = props => {
  const [showDropdown, setShowDropdown] = useState(false);

  const links = (
    <>
      <div>Creating a board</div>
      <div>Inviting a user to a board</div>
      <div>Creating a list</div>
      <div>Creating a card</div>
      <div>Adding members to a card</div>
      <div>Checklists</div>
    </>
  );

  const navLinks = (
    props.isAuth ?
    <Link to="/"><button className={classes.BackBtn}>Back to my boards</button></Link> :
    <>
      <Link to="/login"><button className={classes.LoginBtn}>Login</button></Link>
      <Link to="/signup"><button className={classes.SignupBtn}>Sign up</button></Link>
    </>
  );

  return (
    <>
      <NavContainer showDropdown={showDropdown} closeDropdown={() => setShowDropdown(false)}>
        <div className={classes.NavBarContent}>
          <LogoTitle help />
          <div className={classes.Btns}>{navLinks}</div>
          <DropdownToggle open={showDropdown} clicked={() => setShowDropdown(shown => !shown)} />
        </div>
        <Dropdown show={showDropdown} close={() => setShowDropdown(false)}>
          <div className={classes.Dropdown}>
            {navLinks}
            <div className={classes.Sep}></div>
            {links}
          </div>
        </Dropdown>
      </NavContainer>
      <div className={classes.NavLinks}>{links}</div>
    </>
  );
};

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth
});

export default connect(mapStateToProps)(HelpNav);
