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
      <p>
        Deleting a team will also permanently delete all of this team's boards. If you are sure,
        please type 'DELETE THIS TEAM' below.
      </p>
      <input className={classes.Input} value={inputVal} onChange={e => setInputVal(e.target.value)} />
      <button className={classes.DeleteBtn} disabled={inputVal !== 'DELETE THIS TEAM'} onClick={() => props.deleteTeam(history.push)}>Delete Team</button>
    </div>
  );
};

DeleteTeamModal.propTypes = {
  close: PropTypes.func.isRequired,
  deleteTeam: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  deleteTeam: push => dispatch(deleteTeam(push))
});

export default connect(null, mapDispatchToProps)(DeleteTeamModal);
