import React, { useState } from 'react';
import classes from './HelpNav.module.css';
import LogoTitle from '../../../UI/LogoTitle/LogoTitle';
import DropdownToggle from '../../../UI/DropdownToggle/DropdownToggle';
import Dropdown from '../../../UI/Dropdown/Dropdown';
import { connect } from 'react-redux';
import NavContainer from '../NavContainer/NavContainer';
import PropTypes from 'prop-types';
import { LoginBtn, BackBtn, SignupBtn } from '../NavBtns/NavBtns';

const HelpNav = props => {
  const [showDropdown, setShowDropdown] = useState(false);

  const navHandler = num => {
    props.navigate(num);
    setShowDropdown(false);
  };

  const links = (
    <>
      <div onClick={() => navHandler(1)}>Creating a board</div>
      <div onClick={() => navHandler(2)}>Inviting a user to a board</div>
      <div onClick={() => navHandler(3)}>Creating a list</div>
      <div onClick={() => navHandler(4)}>Creating a card</div>
      <div onClick={() => navHandler(5)}>Deleting a list or card</div>
      <div onClick={() => navHandler(6)}>Roadmaps</div>
      <div onClick={() => navHandler(7)}>Card features</div>
      <div onClick={() => navHandler(8)}>Teams</div>
    </>
  );

  const navLinks = props.isAuth ? <BackBtn /> : <><LoginBtn /><SignupBtn /></>;

  return (
    <>
      <NavContainer showDropdown={showDropdown} closeDropdown={() => setShowDropdown(false)}>
        <div className={classes.NavBarContent}>
          <LogoTitle help />
          <div className={classes.Btns}>{navLinks}</div>
          <DropdownToggle widthToShow={640} open={showDropdown} clicked={() => setShowDropdown(shown => !shown)} />
        </div>
        <Dropdown show={showDropdown} close={() => setShowDropdown(false)} max={640}>
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

HelpNav.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth
});

export default connect(mapStateToProps)(HelpNav);
