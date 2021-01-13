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

  const starredBoards = props.boards.allIDs.filter(boardID => props.boards.byID[boardID].isStarred).map(boardID => props.boards.byID[boardID]);

  const personalBoards = props.boards.allIDs.filter(boardID => !props.teams.byID[props.boards.byID[boardID].teamID]).map(boardID => props.boards.byID[boardID]);

  return (
    <div className={classes.Container}>
      {starredBoards.length > 0 && <>
      <div className={classes.Title}>{starIcon} Starred Boards</div>
      <BoardList boards={starredBoards} /></>}
      <div className={classes.Title}>{personIcon} My Boards</div>
      <BoardList boards={personalBoards} createPersonal />
      {props.teams.allIDs.map(teamID => {
        const team = props.teams.byID[teamID];
        return (
          <div key={teamID}>
            <TeamNavBar title={team.title} url={team.url} teamID={teamID} />
            <BoardList boards={props.boards.allIDs.filter(boardID => props.boards.byID[boardID].teamID === teamID).map(boardID => props.boards.byID[boardID])}
            teamID={teamID} teamTitle={team.title} />
          </div>
        );
      })}
    </div>
  );
};

Dashboard.propTypes = {
  getUserData: PropTypes.func.isRequired,
  boards: PropTypes.object.isRequired,
  teams: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  boards: state.user.boards,
  teams: state.user.teams
});

const mapDispatchToProps = dispatch => ({
  getUserData: () => dispatch(getUserData())
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
