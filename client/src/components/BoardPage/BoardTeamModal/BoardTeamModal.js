import React, { useRef } from 'react';
import classes from './BoardTeamModal.module.css';
import { useModalToggle, useModalPos } from '../../../utils/customHooks';
import PropTypes from 'prop-types';
import ModalTitle from '../../UI/ModalTitle/ModalTitle';
import { Link } from 'react-router-dom';

const BoardTeamModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  useModalPos(true, modalRef);

  return (
    <div ref={modalRef} className={classes.Container}>
      <ModalTitle title={props.team.title} close={props.close} light />
      {props.team.url ?
        <div className={classes.Options}>
          <Link to={`/team/${props.team.url}`}>View team page</Link>
        </div>
      : <p>You are not a member of this board's team.</p>}
    </div>
  );
};

BoardTeamModal.propTypes = {
  close: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired
};

export default BoardTeamModal;
