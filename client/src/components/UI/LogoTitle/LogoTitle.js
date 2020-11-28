import React from 'react';
import classes from './LogoTitle.module.css';
import { checkIcon2 as checkIcon } from '../icons';
import { Link } from 'react-router-dom';

const TitleLogo = props => (
  <div className={props.loading ? `${classes.Container} ${classes.Loading}` : classes.Container}>
    <Link to="/">
      <div className={classes.Logo}>
        <div className={`${classes.Section} ${classes.Sec1}`}>
          {checkIcon}
          <div className={classes.Block}></div>
        </div>
        <div className={`${classes.Section} ${classes.Sec2}`}>
          {checkIcon}
          <div className={classes.Block}></div>
        </div>
        <div className={`${classes.Section} ${classes.Sec3}`}>
          {checkIcon}
          <div className={classes.Block}></div>
        </div>
      </div>
      <div className={classes.Title}>Brello</div>
    </Link>
  </div>
);

export default TitleLogo;
