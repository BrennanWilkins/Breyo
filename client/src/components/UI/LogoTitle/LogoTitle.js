import React from 'react';
import classes from './LogoTitle.module.css';
import { checkIcon2 as checkIcon } from '../icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const TitleLogo = props => (
  <div className={(props.home || props.help || props.tech) ? classes.HomeContainer : props.loading ? `${classes.Container} ${classes.Loading}` : classes.Container}>
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
      {props.home ? <h1>Breyo</h1> : props.help ? <h1>Breyo Help</h1> : props.tech ? <h1>Breyo Tech</h1> : <div className={classes.Title}>Breyo</div>}
    </Link>
  </div>
);

TitleLogo.propTypes = {
  home: PropTypes.bool,
  help: PropTypes.bool,
  loading: PropTypes.bool,
  tech: PropTypes.bool
};

export default TitleLogo;
