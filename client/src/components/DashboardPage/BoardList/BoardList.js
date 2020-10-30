import React, { useRef } from 'react';
import classes from './BoardList.module.css';
import { connect } from 'react-redux';
import { starIcon } from '../../UI/icons';
import { toggleIsStarred } from '../../../store/actions';
import { withRouter } from 'react-router-dom';

const BoardList = props => {
  const starRef = useRef();

  const navHandler = (e, id) => {
    if (starRef.current.contains(e.target)) { return; }
    props.history.push('/board/' + id);
  };

  return (
    <div className={classes.Container}>
      {props.boards.map(board => (
        <div key={board.boardID} className={classes.Board} style={{background: board.color}} onClick={e => navHandler(e, board.boardID)}>
          <span>{board.title}</span>
          <div className={classes.Overlay}></div>
          <div ref={starRef} onClick={() => props.toggleIsStarred(board.boardID)} className={board.isStarred ? classes.Starred : classes.NotStarred}>{starIcon}</div>
        </div>
      ))}
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  toggleIsStarred: id => dispatch(toggleIsStarred(id))
});

export default connect(null, mapDispatchToProps)(withRouter(BoardList));