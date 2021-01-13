import React from 'react';
import classes from './TeamBoards.module.css';
import PropTypes from 'prop-types';
import BoardList from '../../DashboardPage/BoardList/BoardList';
import { connect } from 'react-redux';

const TeamBoards = props => {
  return (
    <div className={classes.Container}>
      <BoardList boards={props.boards.allIDs.filter(boardID => props.boards.byID[boardID].teamID === props.teamID).map(boardID => props.boards.byID[boardID])} 
      teamID={props.teamID} teamTitle={props.teamTitle} />
    </div>
  );
};

TeamBoards.propTypes = {
  boards: PropTypes.object.isRequired,
  teamID: PropTypes.string.isRequired,
  teamTitle: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  boards: state.user.boards,
  teamID: state.team.teamID,
  teamTitle: state.team.title
});

export default connect(mapStateToProps)(TeamBoards);
