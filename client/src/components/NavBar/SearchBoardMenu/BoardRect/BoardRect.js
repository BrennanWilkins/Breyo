import React, { useRef } from 'react';
import classes from './BoardRect.module.css';
import PropTypes from 'prop-types';
import { starIcon } from '../../../UI/icons';
import { useHistory } from 'react-router';
import { getPhotoURL } from '../../../../utils/backgrounds';

const BoardRect = props => {
  const starRef = useRef();
  let history = useHistory();

  const navHandler = e => {
    if (starRef.current.contains(e.target)) { return; }
    history.push(`/board/${props.boardID}`);
    props.close();
  };

  return (
    <div className={classes.Rect} style={props.color[0] === '#' ? {background: props.color} :
    {backgroundImage: getPhotoURL(props.color, 280)}} onClick={navHandler}>
      <span className={props.color[0] === '#' ? classes.Title : `${classes.Title} ${classes.DarkenTitle}`}>{props.title}</span>
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
