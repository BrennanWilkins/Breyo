import React from 'react';
import classes from './HomePage.module.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <div className={classes.NavBar}>
        <div className={classes.Content}>
          <h1 className={classes.Title}>Brello</h1>
          <div className={classes.Btns}>
            <Link to="/login"><span className={classes.LoginBtn}>LOG IN</span></Link>
            <Link to="/signup"><span className={classes.SignupBtn}>SIGN UP</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
