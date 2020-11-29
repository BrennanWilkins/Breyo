import React from 'react';
import classes from './HelpPage.module.css';
import { Link } from 'react-router-dom';
import LogoTitle from '../../UI/LogoTitle/LogoTitle';

const HelpPage = props => {
  return (
    <div>
      <div className={classes.NavBar}>
        <div className={classes.NavBarContent}>
          <LogoTitle help />
          {props.isAuth ?
            <Link to="/"><button className={classes.BackBtn}>Back to my boards</button></Link> :
            <div className={classes.Btns}>
              <Link to="/login"><button className={classes.LoginBtn}>Login</button></Link>
              <Link to="/signup"><button className={classes.SignupBtn}>Sign up</button></Link>
            </div>
          }
        </div>
      </div>
      <div className={classes.Content}>
      </div>
    </div>
  );
};

export default HelpPage;
