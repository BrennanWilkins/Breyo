import React from 'react';
import classes from './TeamNavBar.module.css';
import { teamIcon, boardIcon, settingsIcon, personIcon } from '../../UI/icons';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { ActionBtn } from '../../UI/Buttons/Buttons';

const TeamNavBar = props => {
  const history = useHistory();

  return (
    <div className={classes.Container}>
      <div className={classes.Title}>{teamIcon}<div>{props.title}</div></div>
      <div className={classes.Btns}>
        <ActionBtn>{boardIcon} Boards</ActionBtn>
        <ActionBtn>{personIcon} Members</ActionBtn>
        <ActionBtn>{settingsIcon} Settings</ActionBtn>
      </div>
    </div>
  );
};

TeamNavBar.propTypes = {
  teamID: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default TeamNavBar;
