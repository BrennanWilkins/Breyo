import React, { useState, useRef } from 'react';
import classes from './BoardTeamModal.module.css';
import { useModalToggle, useModalPos } from '../../../utils/customHooks';
import PropTypes from 'prop-types';
import ModalTitle from '../../UI/ModalTitle/ModalTitle';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { BackBtn } from '../../UI/Buttons/Buttons';
import { changeBoardTeam, removeBoardFromTeam } from '../../../store/actions';

const BoardTeamModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  useModalPos(true, modalRef);
  const [showChangeTeam, setShowChangeTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(props.team.teamID);

  const changeTeamHandler = () => {
    if (selectedTeam === props.team.teamID) { return; }
    if (!selectedTeam) { return props.removeBoardFromTeam(); }
    props.changeTeam(props.team.teamID, selectedTeam);
    setShowChangeTeam(false);
  };

  return (
    <div ref={modalRef} className={classes.Container}>
      <ModalTitle title={showChangeTeam ? 'Change Team' : props.team.title} close={props.close} light />
      {showChangeTeam && <div className={classes.BackBtn}><BackBtn back={() => setShowChangeTeam(false)} /></div>}
      {props.teams.byID[props.team.teamID] ?
        showChangeTeam ?
          <div className={classes.Select}>
            <div className={classes.Label}>This board is part of</div>
            <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
              {props.teams.allIDs.map(teamID => (
                <option key={teamID} value={teamID}>{props.teams.byID[teamID].title}</option>
              ))}
              <option value="">No team (personal boards)</option>
            </select>
            <button className={classes.ChangeBtn} disabled={!props.userIsAdmin} onClick={changeTeamHandler}>Change</button>
            {!props.userIsAdmin && <div className={classes.ErrMsg}>You must be an admin of this board to change teams.</div>}
          </div>
        :
          <div className={classes.Options}>
            <div onClick={() => setShowChangeTeam(true)}>Change team</div>
            <Link to={`/team/${props.teams.byID[props.team.teamID].url}`}>View team page</Link>
          </div>
      : <p>You are not a member of this board's team.</p>}
    </div>
  );
};

BoardTeamModal.propTypes = {
  close: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  changeTeam: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  teams: PropTypes.object.isRequired,
  removeBoardFromTeam: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  teams: state.user.teams,
  userIsAdmin: state.board.userIsAdmin
});

const mapDispatchToProps = dispatch => ({
  changeTeam: (oldTeamID, newTeamID) => dispatch(changeBoardTeam(oldTeamID, newTeamID)),
  removeBoardFromTeam: () => dispatch(removeBoardFromTeam())
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardTeamModal);
