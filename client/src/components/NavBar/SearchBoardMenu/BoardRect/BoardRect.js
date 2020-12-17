import React from 'react';
import classes from './BoardRect.module.css';
import PropTypes from 'prop-types';
import { starIcon } from '../../../UI/icons';
import { getPhotoURL } from '../../../../utils/backgrounds';

const BoardRect = props => {
  const starredHandler = e => {
    e.stopPropagation();
    props.toggleIsStarred();
  };

  return (
    <div className={classes.Rect} style={props.color[0] === '#' ? {background: props.color} :
    {backgroundImage: getPhotoURL(props.color, 280)}} onClick={() => props.nav(props.boardID)}>
      <span className={props.color[0] === '#' ? classes.Title : `${classes.Title} ${classes.DarkenTitle}`}>{props.title}</span>
      <div className={classes.Overlay}></div>
      <div onClick={starredHandler} className={props.isStarred ? classes.Starred : classes.NotStarred}>{starIcon}</div>
    </div>
  );
};

BoardRect.propTypes = {
  isStarred: PropTypes.bool.isRequired,
  toggleIsStarred: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  nav: PropTypes.func.isRequired
};

export default BoardRect;
