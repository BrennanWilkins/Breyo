import React from 'react';
import classes from './BoardList.module.css';
import { connect } from 'react-redux';
import { starIcon } from '../../UI/icons';
import { toggleIsStarred, toggleCreateBoard, openCreateTeamBoard } from '../../../store/actions';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { getPhotoURL } from '../../../utils/backgrounds';

const BoardList = props => {
  const history = useHistory();

  const navHandler = boardID => {
    history.push('/board/' + boardID);
  };

  const starClickHandler = (e, boardID) => {
    e.stopPropagation();
    props.toggleIsStarred(boardID);
  };

  return (
    <div className={classes.Container}>
      {props.boards.map(board => (
        <div key={board.boardID} className={classes.Board} onClick={() => navHandler(board.boardID)}
        style={board.color[0] === '#' ? {background: board.color} : {backgroundImage: getPhotoURL(board.color, 200)}}>
          <span>{board.title}</span>
          <div className={classes.Overlay}></div>
          <div onClick={e => starClickHandler(e, board.boardID)} className={board.isStarred ? classes.Starred : classes.NotStarred}>{starIcon}</div>
        </div>
      ))}
      {props.createPersonal && <div className={classes.CreateBoard} onClick={props.toggleCreateBoard}>
        <div className={classes.CreateText}>Create a new board</div>
      </div>}
      {props.teamID && <div className={classes.CreateBoard} onClick={() => props.openCreateTeamBoard(props.teamID, props.teamTitle)}>
        <div className={classes.CreateText}>Create a new board</div>
      </div>}
    </div>
  );
};

BoardList.propTypes = {
  toggleIsStarred: PropTypes.func.isRequired,
  boards: PropTypes.array.isRequired,
  createPersonal: PropTypes.bool,
  toggleCreateBoard: PropTypes.func.isRequired,
  teamID: PropTypes.string,
  teamTitle: PropTypes.string,
  openCreateTeamBoard: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleIsStarred: boardID => dispatch(toggleIsStarred(boardID)),
  toggleCreateBoard: () => dispatch(toggleCreateBoard()),
  openCreateTeamBoard: (teamID, teamTitle) => dispatch(openCreateTeamBoard(teamID, teamTitle))
});

export default connect(null, mapDispatchToProps)(BoardList);
