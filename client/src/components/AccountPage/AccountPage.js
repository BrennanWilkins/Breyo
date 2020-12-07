import React, { useState, useEffect } from 'react';
import classes from './AccountPage.module.css';
import { withRouter } from 'react-router-dom';
import AccountSettings from './AccountSettings/AccountSettings';
import UserActivity from './UserActivity/UserActivity';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AccountHeader from './AccountHeader/AccountHeader';

const AccountPage = props => {
  const [showSettings, setShowSettings] = useState(true);

  useEffect(() => {
    if (props.location.search === '?view=activity') { setShowSettings(false); }
  }, [props.location]);

  return (
    <div className={classes.Container}>
      <AccountHeader email={props.email} fullName={props.fullName} />
      <div className={classes.Btns}>
        <button className={!showSettings ? classes.ActiveBtn : null} onClick={() => setShowSettings(false)}>Activity</button>
        <button className={showSettings ? classes.ActiveBtn : null} onClick={() => setShowSettings(true)}>Settings</button>
      </div>
      {showSettings ? <AccountSettings /> : <UserActivity />}
    </div>
  );
};

AccountPage.propTypes = {
  email: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  email: state.auth.email,
  fullName: state.auth.fullName
});

export default connect(mapStateToProps)(withRouter(AccountPage));
