import React, { useRef } from 'react';
import classes from './LeaveTeamModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';
import PropTypes from 'prop-types';
import { leaveTeam } from '../../../../store/actions';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';

const LeaveTeamModal = props => {
  const history = useHistory();
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  const leaveHandler = () => {
    props.leaveTeam(history.push);
    props.close();
  };

  return (
    <div ref={modalRef} className={classes.Container}>
      <ModalTitle close={props.close} title="Leave this team" />
      <p>Leaving a team will not cause you to be removed from any of the team's boards.</p>
      <button className={classes.LeaveBtn} onClick={leaveHandler}>Leave team</button>
    </div>
  );
};

LeaveTeamModal.propTypes = {
  close: PropTypes.func.isRequired,
  leaveTeam: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  leaveTeam: push => dispatch(leaveTeam(push))
});

export default connect(null, mapDispatchToProps)(LeaveTeamModal);
