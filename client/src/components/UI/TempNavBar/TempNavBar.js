import React from 'react';
import classes from './TempNavBar.module.css';
import { houseIcon, boardIcon, plusIcon, personIcon } from '../icons';
import Button, { AccountBtn } from '../Buttons/Buttons';
import Spinner from '../Spinner/Spinner';
import LogoTitle from '../LogoTitle/LogoTitle';

const TempNavBar = () => (
  <>
    <div className={classes.TempNavBar}>
      <div className={classes.Section}>
        <Button>{houseIcon}</Button>
        <Button>{boardIcon}<span>Boards</span></Button>
      </div>
      <LogoTitle loading />
      <div className={classes.Section}>
        <Button>{plusIcon}</Button>
        <AccountBtn><span className={classes.PersonIcon}>{personIcon}</span></AccountBtn>
      </div>
    </div>
    <Spinner />
  </>
);

export default TempNavBar;
