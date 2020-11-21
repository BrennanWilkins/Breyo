import React from 'react';
import PropTypes from 'prop-types';
import classes from './AccountInfo.module.css';

const AccountInfo = props => (
  <div className={classes.AccountInfo}
  style={{ padding: props.givePadding ? '15px 0' : '0 0 15px 0', borderBottom: props.noBorder ? '0' : '1px solid #ddd'}}>
    <div className={classes.NameIcon}>{props.fullName.slice(0, 1)}</div>
    <div className={classes.Details}>
      <div className={classes.Name}>{props.fullName}</div>
      <div className={classes.Email}>{props.email}</div>
    </div>
  </div>
);

AccountInfo.propTypes = {
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  givePadding: PropTypes.bool
};

export default AccountInfo;
