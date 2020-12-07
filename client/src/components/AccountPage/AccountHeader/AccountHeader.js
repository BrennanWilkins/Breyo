import React from 'react';
import classes from './AccountHeader.module.css';
import PropTypes from 'prop-types';

const AccountHeader = props => (
  <div className={classes.AccountInfo}>
    <div className={classes.NameIcon}>{props.fullName.slice(0, 1)}</div>
    <div className={classes.Name}>{props.fullName}</div>
    <div className={classes.Email}>{props.email}</div>
  </div>
);

AccountHeader.propTypes = {
  email: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired
};

export default AccountHeader;
