import React from 'react';
import classes from './Invites.module.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../../../UI/Buttons/Buttons';
import { acceptInvite, rejectInvite } from '../../../../store/actions';

const Invites = props => {
  return (
    <div className={classes.Invites}>
      {props.invites.length === 0 ?
        <div className={classes.NoInvites}>You don't have any board invites.</div>
      : props.invites.map(invite => (
        <div key={invite.boardID} className={classes.Invite}>
          <div>{invite.inviterName}<span className={classes.Email}> ({invite.inviterEmail}) </span>
          invited you to the board <span className={classes.Title}>{invite.title}</span>.</div>
          <div className={classes.Btns}>
            <span className={classes.AcceptBtn}><Button clicked={() => props.acceptInvite(invite.boardID)}>Accept</Button></span>
            <span className={classes.RejectBtn}><Button clicked={() => props.rejectInvite(invite.boardID)}>Reject</Button></span>
          </div>
        </div>
      ))}
    </div>
  );
};

Invites.propTypes = {
  invites: PropTypes.array.isRequired,
  acceptInvite: PropTypes.func.isRequired,
  rejectInvite: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  invites: state.auth.invites
});

const mapDispatchToProps = dispatch => ({
  acceptInvite: boardID => dispatch(acceptInvite(boardID)),
  rejectInvite: boardID => dispatch(rejectInvite(boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(Invites);