import React from 'react';
import PropTypes from 'prop-types';
import classes from './Notifications.module.css';
import { connect } from 'react-redux';
import { CloseBtn } from '../UI/Buttons/Buttons';
import { deleteNotif } from '../../store/actions';
import { alertIcon } from '../UI/icons';

const Notifications = props => (
  <div className={classes.Notifs}>
    {props.notifs.map(({ id, msg }) => (
      <div key={id} className={classes.Notif}>
        <span className={classes.Icon}>{alertIcon}</span>
        {msg}
        <CloseBtn close={() => props.deleteNotif(id)} />
      </div>
    ))}
  </div>
);

Notifications.propTypes = {
  notifs: PropTypes.array.isRequired,
  deleteNotif: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  notifs: state.notifications.notifs
});

const mapDispatchToProps = dispatch => ({
  deleteNotif: id => dispatch(deleteNotif(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
