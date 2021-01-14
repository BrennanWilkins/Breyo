import React from 'react';
import classes from './Invites.module.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../../../UI/Buttons/Buttons';
import { acceptInvite, rejectInvite, acceptTeamInvite, rejectTeamInvite } from '../../../../store/actions';
import { useHistory } from 'react-router';

const Invites = props => {
  const history = useHistory();

  const acceptHandler = boardID => {
    props.acceptInvite(boardID, history.push);
    props.close();
  };

  const acceptTeamHandler = teamID => {
    props.acceptTeamInvite(teamID, history.push);
    props.close();
  };

  return (
    <div className={classes.Invites}>
      {(!props.invites.length && !props.teamInvites.length) ?
        <div className={classes.NoInvites}>You don't have any board or team invites.</div>
      : <>
        {props.invites.map(invite => (
          <div key={invite.boardID} className={classes.Invite}>
            <div>{invite.inviterName}<span className={classes.Email}> ({invite.inviterEmail}) </span>
            invited you to the board <span className={classes.Title}>{invite.title}</span>.</div>
            <div className={classes.Btns}>
              <Button className={classes.AcceptBtn} clicked={() => acceptHandler(invite.boardID)}>Accept</Button>
              <Button className={classes.RejectBtn} clicked={() => props.rejectInvite(invite.boardID)}>Reject</Button>
            </div>
          </div>
        ))}
        {props.teamInvites.map(invite => (
          <div key={invite.teamID} className={classes.Invite}>
            <div>{invite.inviterName}<span className={classes.Email}> ({invite.inviterEmail}) </span>
            invited you to the team <span className={classes.Title}>{invite.title}</span>.</div>
            <div className={classes.Btns}>
              <Button className={classes.AcceptBtn} clicked={() => acceptTeamHandler(invite.teamID)}>Accept</Button>
              <Button className={classes.RejectBtn} clicked={() => props.rejectTeamInvite(invite.teamID)}>Reject</Button>
            </div>
          </div>
        ))}
      </>}
    </div>
  );
};

Invites.propTypes = {
  invites: PropTypes.array.isRequired,
  acceptInvite: PropTypes.func.isRequired,
  rejectInvite: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  teamInvites: PropTypes.array.isRequired,
  acceptTeamInvite: PropTypes.func.isRequired,
  rejectTeamInvite: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  acceptInvite: (boardID, push) => dispatch(acceptInvite(boardID, push)),
  rejectInvite: boardID => dispatch(rejectInvite(boardID)),
  acceptTeamInvite: (teamID, push) => dispatch(acceptTeamInvite(teamID, push)),
  rejectTeamInvite: teamID => dispatch(rejectTeamInvite(teamID))
});

export default connect(null, mapDispatchToProps)(Invites);
