import React from 'react';
import classes from './TeamBoards.module.css';
import PropTypes from 'prop-types';
import BoardList from '../../DashboardPage/BoardList/BoardList';
import { connect } from 'react-redux';

const TeamBoards = props => {
  return (
    <div className={classes.Container}>
      <BoardList boards={props.boards.filter(board => board.teamID === props.teamID)} teamID={props.teamID} teamTitle={props.teamTitle} />
    </div>
  );
};

TeamBoards.propTypes = {
  boards: PropTypes.array.isRequired,
  teamID: PropTypes.string.isRequired,
  teamTitle: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  boards: state.user.boards,
  teamID: state.team.teamID,
  teamTitle: state.team.title
});

export default connect(mapStateToProps)(TeamBoards);
