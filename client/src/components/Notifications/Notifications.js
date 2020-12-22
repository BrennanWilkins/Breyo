import React from 'react';
import PropTypes from 'prop-types';
import classes from './Notifications.module.css';
import { connect } from 'react-redux';
import { CloseBtn } from '../UI/Buttons/Buttons';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { deleteNotif } from '../../store/actions';
import { alertIcon } from '../UI/icons';

const Notifications = props => (
  <TransitionGroup className={classes.Notifs}>
    {props.notifs.map(({ id, msg }, i) => (
      <CSSTransition key={id} timeout={500} classNames={{ enter: classes.Enter, enterActive: classes.EnterActive, exit: classes.Exit, exitActive: classes.ExitActive }}>
        <div className={classes.Notif}>
          <span className={classes.Icon}>{alertIcon}</span>
          {msg}
          <CloseBtn close={() => props.deleteNotif(id)} />
        </div>
      </CSSTransition>
    ))}
  </TransitionGroup>
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
