import React from 'react';
import classes from './CreateMenu.module.css';
import PropTypes from 'prop-types';
import { boardIcon, teamIcon } from '../../UI/icons';
import ModalContainer from '../../UI/ModalContainer/ModalContainer';

const CreateMenu = props => (
  <ModalContainer className={classes.Container} title="Create" close={props.close} light>
    <div className={classes.Option} style={{ marginTop: '5px' }} onClick={() => { props.openCreateBoard(); props.close(); }}>
      <div className={classes.Title}>{boardIcon} Create a board</div>
      <div className={classes.Info}>
        A board consists of lists with cards. Boards allow you to track, manage, or organize your projects.
      </div>
    </div>
    <div className={classes.Option} onClick={() => { props.openCreateTeam(); props.close(); }}>
      <div className={classes.Title}>{teamIcon} Create a team</div>
      <div className={classes.Info}>
        A team consists of a group of boards and team members. Teams allow you to organize your organization or project across boards.
      </div>
    </div>
  </ModalContainer>
);

CreateMenu.propTypes = {
  close: PropTypes.func.isRequired,
  openCreateBoard: PropTypes.func.isRequired,
  openCreateTeam: PropTypes.func.isRequired
};

export default CreateMenu;
