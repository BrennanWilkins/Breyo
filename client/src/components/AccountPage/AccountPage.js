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
      <AccountHeader email={props.email} fullName={props.fullName} avatar={props.avatar} />
      <div className={classes.Btns}>
        <Link to="/my-account?view=activity" className={!showSettings ? classes.Active : classes.Btn}>Activity</Link>
        <Link to="/my-account?view=settings" className={showSettings ? classes.Active : classes.Btn}>Settings</Link>
      </div>
      {showSettings ? <AccountSettings /> : <UserActivity />}
    </div>
  );
};

AccountPage.propTypes = {
  email: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  avatar: PropTypes.string
};

const mapStateToProps = state => ({
  email: state.user.email,
  fullName: state.user.fullName,
  avatar: state.user.avatar
});

export default connect(mapStateToProps)(withRouter(AccountPage));
