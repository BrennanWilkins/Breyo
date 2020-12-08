import React, { useRef } from 'react';
import classes from './BoardRect.module.css';
import PropTypes from 'prop-types';
import { starIcon } from '../../../UI/icons';
import { useHistory } from 'react-router';

const BoardRect = props => {
  const starRef = useRef();
  let history = useHistory();

  const navHandler = e => {
    if (starRef.current.contains(e.target)) { return; }
    history.push(`/board/${props.boardID}`);
    props.close();
  };

  return (
    <div className={classes.Rect} style={{background: props.color}} onClick={navHandler}>
      <span className={classes.Title}>{props.title}</span>
      <div className={classes.Overlay}></div>
      <div ref={starRef} onClick={props.toggleIsStarred} className={props.isStarred ? classes.Starred : classes.NotStarred}>{starIcon}</div>
    </div>
  );
};

BoardRect.propTypes = {
  isStarred: PropTypes.bool.isRequired,
  toggleIsStarred: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
};

export default BoardRect;
