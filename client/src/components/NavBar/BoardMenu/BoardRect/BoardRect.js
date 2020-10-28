import React from 'react';
import classes from './BoardRect.module.css';
import PropTypes from 'prop-types';
import { starIcon } from '../../../UI/icons';

const BoardRect = props => (
  <div className={classes.Rect} style={{background: props.color}}>
    <span className={classes.Title}>{props.title}</span>
    <div className={classes.Overlay}></div>
    <div onClick={props.toggleIsStarred} className={props.isStarred ? classes.Starred : classes.NotStarred}>{starIcon}</div>
  </div>
);

BoardRect.propTypes = {
  isStarred: PropTypes.bool.isRequired,
  toggleIsStarred: PropTypes.func.isRequired,
  boardID: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};

export default BoardRect;
