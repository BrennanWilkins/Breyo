import React from 'react';
import classes from './BoardList.module.css';
import { connect } from 'react-redux';
import { starIcon } from '../../UI/icons';
import { toggleIsStarred } from '../../../store/actions';

const BoardList = props => {
  return (
    <div className={classes.Container}>
      {props.boards.map(board => (
        <div key={board.boardID} className={classes.Board} style={{background: board.color}}>
          <span>{board.title}</span>
          <div className={classes.Overlay}></div>
          <div onClick={() => props.toggleIsStarred(board.boardID)} className={board.isStarred ? classes.Starred : classes.NotStarred}>{starIcon}</div>
        </div>
      ))}
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  toggleIsStarred: id => dispatch(toggleIsStarred(id))
});

export default connect(null, mapDispatchToProps)(BoardList);
