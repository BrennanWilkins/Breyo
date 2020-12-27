import React from 'react';
import classes from './AccountHeader.module.css';
import PropTypes from 'prop-types';

const AccountHeader = props => (
  <div className={classes.AccountInfo}>
    <div className={classes.NameIcon}>{props.avatar ? <img src={props.avatar} alt="" /> : props.fullName[0]}</div>
    <div className={classes.Name}>{props.fullName}</div>
    <div className={classes.Email}>{props.email}</div>
  </div>
);

AccountHeader.propTypes = {
  email: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  avatar: PropTypes.string
};

export default AccountHeader;
