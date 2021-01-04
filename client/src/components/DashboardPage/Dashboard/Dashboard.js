import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './Dashboard.module.css';
import { connect } from 'react-redux';
import { getUserData } from '../../../store/actions';
import BoardList from '../BoardList/BoardList';
import { personIcon, starIcon } from '../../UI/icons';
import TeamNavBar from '../TeamNavBar/TeamNavBar';

const Dashboard = props => {
  useEffect(() => props.getUserData(), []);

  const starredBoards = props.boards.filter(board => board.isStarred);

  const personalBoards = props.boards.filter(board => !props.teams.find(team => team.teamID === board.teamID));

  return (
    <div className={classes.Container}>
      {starredBoards.length > 0 && <>
      <div className={classes.Title}>{starIcon} Starred Boards</div>
      <BoardList boards={starredBoards} /></>}
      <div className={classes.Title}>{personIcon} My Boards</div>
      <BoardList boards={personalBoards} createPersonal />
      {props.teams.map(team => (
        <div key={team.teamID}>
          <TeamNavBar title={team.title} url={team.url} teamID={team.teamID} />
          <BoardList boards={props.boards.filter(board => board.teamID === team.teamID)} teamID={team.teamID} teamTitle={team.title} />
        </div>
      ))}
    </div>
  );
};

Dashboard.propTypes = {
  getUserData: PropTypes.func.isRequired,
  boards: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  boards: state.user.boards,
  teams: state.user.teams
});

const mapDispatchToProps = dispatch => ({
  getUserData: () => dispatch(getUserData())
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
