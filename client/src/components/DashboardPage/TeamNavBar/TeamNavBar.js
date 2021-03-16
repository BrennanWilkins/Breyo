import React from 'react';
import classes from './TeamNavBar.module.css';
import { teamIcon, boardIcon, settingsIcon, personIcon } from '../../UI/icons';
import PropTypes from 'prop-types';
import { ActionBtn } from '../../UI/Buttons/Buttons';
import { Link } from 'react-router-dom';

const TeamNavBar = props => (
  <div className={classes.Container}>
    <div className={classes.Title}>{teamIcon}<div>{props.title}</div></div>
    <div className={classes.Btns}>
      <Link to={`/team/${props.url}/?view=boards`}><ActionBtn>{boardIcon} Boards</ActionBtn></Link>
      <Link to={`/team/${props.url}/?view=members`}><ActionBtn>{personIcon} Members</ActionBtn></Link>
      <Link to={`/team/${props.url}/?view=settings`}><ActionBtn>{settingsIcon} Settings</ActionBtn></Link>
    </div>
  </div>
);

TeamNavBar.propTypes = {
  teamID: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default TeamNavBar;
