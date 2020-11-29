import React, { useState, useEffect } from 'react';
import classes from './HomeNav.module.css';
import { Link } from 'react-router-dom';
import LogoTitle from '../../UI/LogoTitle/LogoTitle';

const HomeNav = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const resizeHandler = () => {
      // if dropdown not shown make sure document overflow is correct
      if (window.innerWidth > 480) { setShowDropdown(false); }
    };

    if (showDropdown) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('resize', resizeHandler);
    }
    else {
      document.body.style.overflow = 'auto';
    }

    return () => window.removeEventListener('resize', resizeHandler);
  }, [showDropdown]);

  useEffect(() => {
    return () => document.body.style.overflow = 'auto';
  }, []);

  return (
    <>
      {showDropdown && <div className={classes.Backdrop} onClick={() => setShowDropdown(false)}></div>}
      <div className={classes.NavBar}>
        <div className={classes.NavBarContent}>
          <LogoTitle home />
          <div className={classes.NavBtns}>
            <Link to="/tech"><button className={classes.NavBtn}>Tech</button></Link>
            <Link to="/help"><button className={classes.NavBtn}>Help</button></Link>
            <Link to="/login"><button className={`${classes.NavBtn} ${classes.LoginBtn}`}>Login</button></Link>
            <div className={`${classes.DropdownToggle} ${showDropdown ? classes.Open : classes.Closed}`} onClick={() => setShowDropdown(shown => !shown)}><div></div></div>
          </div>
        </div>
        {showDropdown && <div className={classes.Dropdown}>
          <Link to="/tech"><button className={classes.DropdownBtn}>Tech</button></Link>
          <Link to="/help"><button className={classes.DropdownBtn}>Help</button></Link>
          <Link to="/login"><button className={`${classes.DropdownBtn} ${classes.LoginBtn}`}>Login</button></Link>
          <Link to="/signup"><button className={`${classes.DropdownBtn} ${classes.SignupBtn}`}>Sign up</button></Link>
        </div>}
      </div>
    </>
  );
};

export default HomeNav;
