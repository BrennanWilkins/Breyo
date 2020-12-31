import React, { useRef } from 'react';
import classes from './CreateMenu.module.css';
import { useModalToggle } from '../../../utils/customHooks';
import ModalTitle from '../../UI/ModalTitle/ModalTitle';
import PropTypes from 'prop-types';
import { boardIcon, teamIcon } from '../../UI/icons';

const CreateMenu = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div ref={modalRef} className={classes.Container}>
      <ModalTitle title="Create" close={props.close} light />
      <div className={classes.Option} style={{ marginTop: '5px' }} onClick={() => { props.toggleCreateBoard(); props.close(); }}>
        <div className={classes.Title}>{boardIcon} Create a board</div>
        <div className={classes.Info}>
          A board consists of lists with cards. Boards allow you to track, manage, or organize your projects.
        </div>
      </div>
      <div className={classes.Option} onClick={() => { props.toggleCreateTeam(); props.close(); }}>
        <div className={classes.Title}>{teamIcon} Create a team</div>
        <div className={classes.Info}>
          A team consists of a group of boards and team members. Teams allow you to organize your organization or project across boards.
        </div>
      </div>
    </div>
  );
};

CreateMenu.propTypes = {
  close: PropTypes.func.isRequired,
  toggleCreateBoard: PropTypes.func.isRequired,
  toggleCreateTeam: PropTypes.func.isRequired
};

export default CreateMenu;
