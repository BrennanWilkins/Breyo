import React, { useRef } from 'react';
import classes from './BoardList.module.css';
import { connect } from 'react-redux';
import { starIcon } from '../../UI/icons';
import { toggleIsStarred } from '../../../store/actions';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { getPhotoURL } from '../../../utils/backgrounds';

const BoardList = props => {
  const starRef = useRef();
  let history = useHistory();

  const navHandler = (e, id) => {
    if (starRef.current.contains(e.target)) { return; }
    history.push('/board/' + id);
  };

  return (
    <div className={classes.Container}>
      {props.boards.map(board => (
        <div key={board.boardID} className={classes.Board} onClick={e => navHandler(e, board.boardID)}
        style={board.color[0] === '#' ? {background: board.color} : {backgroundImage: getPhotoURL(board.color, 200)}}>
          <span>{board.title}</span>
          <div className={classes.Overlay}></div>
          <div ref={starRef} onClick={() => props.toggleIsStarred(board.boardID)} className={board.isStarred ? classes.Starred : classes.NotStarred}>{starIcon}</div>
        </div>
      ))}
    </div>
  );
};

BoardList.propTypes = {
  toggleIsStarred: PropTypes.func.isRequired,
  boards: PropTypes.array.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleIsStarred: boardID => dispatch(toggleIsStarred(boardID))
});

export default connect(null, mapDispatchToProps)(BoardList);
