import React, { useState, useRef } from 'react';
import classes from './AddToTeamModal.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useModalToggle, useModalPos } from '../../../utils/customHooks';
import ModalTitle from '../../UI/ModalTitle/ModalTitle';
import { addToTeam } from '../../../store/actions';

const AddToTeamModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  useModalPos(true, modalRef);
  const [selectedTeam, setSelectedTeam] = useState('');

  const addToTeamHandler = () => {
    if (selectedTeam === '') { return; }
    props.addToTeam(selectedTeam);
    props.close();
  };

  return (
    <div ref={modalRef} className={classes.Container}>
      <ModalTitle title="Add to team" close={props.close} light />
      <div className={classes.Select}>
        <div className={classes.Label}>Your teams</div>
        <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)} disabled={!props.userIsAdmin}>
          {selectedTeam === '' && <option value="">Choose a team</option>}
          {props.teams.map(team => (
            <option key={team.teamID} value={team.teamID}>{team.title}</option>
          ))}
        </select>
        <button className={classes.AddBtn} disabled={selectedTeam === '' || !props.userIsAdmin} onClick={addToTeamHandler}>Add to team</button>
      </div>
      {!props.userIsAdmin && <div className={classes.ErrMsg}>You must be an admin of this board to add it to a team.</div>}
    </div>
  );
};

AddToTeamModal.propTypes = {
  close: PropTypes.func.isRequired,
  addToTeam: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
  userIsAdmin: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  teams: state.user.teams,
  userIsAdmin: state.board.userIsAdmin
});

const mapDispatchToProps = dispatch => ({
  addToTeam: teamID => dispatch(addToTeam(teamID))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddToTeamModal);
