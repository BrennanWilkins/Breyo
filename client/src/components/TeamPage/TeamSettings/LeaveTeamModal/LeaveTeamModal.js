import React from 'react';
import classes from './LeaveTeamModal.module.css';
import PropTypes from 'prop-types';
import { leaveTeam } from '../../../../store/actions';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';
import { DeleteBtn } from '../../../UI/Buttons/Buttons';

const LeaveTeamModal = props => {
  const history = useHistory();

  const isOnlyAdmin = props.adminCount === 1 && props.userIsAdmin;

  const leaveHandler = () => {
    props.leaveTeam(history.push);
    props.close();
  };

  return (
    <ModalContainer className={classes.Container} close={props.close} title="Leave this team" addMargin>
      {isOnlyAdmin ?
      <div className={classes.CannotLeave}>There must be at least one other admin to leave this team.</div>
      : <>
        <p>Leaving a team will not cause you to be removed from any of the team's boards.</p>
        <DeleteBtn className={classes.LeaveBtn} clicked={leaveHandler}>LEAVE TEAM</DeleteBtn>
      </>}
    </ModalContainer>
  );
};

LeaveTeamModal.propTypes = {
  close: PropTypes.func.isRequired,
  leaveTeam: PropTypes.func.isRequired,
  adminCount: PropTypes.number.isRequired,
  userIsAdmin: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  adminCount: state.team.members.filter(member => member.isAdmin).length,
  userIsAdmin: state.team.userIsAdmin
});

const mapDispatchToProps = dispatch => ({
  leaveTeam: push => dispatch(leaveTeam(push))
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaveTeamModal);
