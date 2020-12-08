import React, { useState, useEffect } from 'react';
import classes from './AccountPage.module.css';
import { withRouter } from 'react-router-dom';
import AccountSettings from './AccountSettings/AccountSettings';
import UserActivity from './UserActivity/UserActivity';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AccountHeader from './AccountHeader/AccountHeader';
import { Link } from 'react-router-dom';

const AccountPage = props => {
  const [showSettings, setShowSettings] = useState(true);

  useEffect(() => {
    if (props.location.search === '?view=activity') { setShowSettings(false); }
    else { setShowSettings(true); }
  }, [props.location]);

  return (
    <div className={classes.Container}>
      <AccountHeader email={props.email} fullName={props.fullName} />
      <div className={classes.Btns}>
        <Link to="/my-account?view=activity" className={!showSettings ? classes.Active : null}>Activity</Link>
        <Link to="/my-account?view=settings" className={showSettings ? classes.Active : null}>Settings</Link>
      </div>
      {showSettings ? <AccountSettings /> : <UserActivity email={props.email} />}
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
