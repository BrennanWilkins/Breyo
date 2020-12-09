import React from 'react';
import classes from './Invites.module.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../../../UI/Buttons/Buttons';
import { acceptInvite, rejectInvite } from '../../../../store/actions';
import { useHistory } from 'react-router';

const Invites = props => {
  const history = useHistory();

  const acceptHandler = boardID => {
    props.acceptInvite(boardID, props.email, props.fullName, history.push);
    props.close();
  };

  return (
    <div className={classes.Invites}>
      {props.invites.length === 0 ?
        <div className={classes.NoInvites}>You don't have any board invites.</div>
      : props.invites.map(invite => (
        <div key={invite.boardID} className={classes.Invite}>
          <div>{invite.inviterName}<span className={classes.Email}> ({invite.inviterEmail}) </span>
          invited you to the board <span className={classes.Title}>{invite.title}</span>.</div>
          <div className={classes.Btns}>
            <span className={classes.AcceptBtn}><Button clicked={() => acceptHandler(invite.boardID)}>Accept</Button></span>
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
  rejectInvite: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  acceptInvite: (boardID, email, fullName, push) => dispatch(acceptInvite(boardID, email, fullName, push)),
  rejectInvite: boardID => dispatch(rejectInvite(boardID))
});

export default connect(null, mapDispatchToProps)(Invites);
