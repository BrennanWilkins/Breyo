import React, { useState, useRef } from 'react';
import classes from './DeleteTeamModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';
import PropTypes from 'prop-types';
import { deleteTeam } from '../../../../store/actions';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';

const DeleteTeamModal = props => {
  const history = useHistory();
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [inputVal, setInputVal] = useState('');

  return (
    <div ref={modalRef} className={classes.Modal}>
      <ModalTitle title="Delete this team?" close={props.close} />
      {props.userIsAdmin ?
      <>
        <p>Deleting a team will not delete the team's boards. To confirm, please type 'DELETE THIS TEAM' below.</p>
        <input className={classes.Input} value={inputVal} onChange={e => setInputVal(e.target.value)} />
        <button className={classes.DeleteBtn} disabled={inputVal !== 'DELETE THIS TEAM'} onClick={() => props.deleteTeam(history.push)}>Delete Team</button>
      </>
      : <p>You must be an admin to delete this team.</p>}
    </div>
  );
};

DeleteTeamModal.propTypes = {
  close: PropTypes.func.isRequired,
  deleteTeam: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  userIsAdmin: state.team.userIsAdmin
});

const mapDispatchToProps = dispatch => ({
  deleteTeam: push => dispatch(deleteTeam(push))
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTeamModal);
