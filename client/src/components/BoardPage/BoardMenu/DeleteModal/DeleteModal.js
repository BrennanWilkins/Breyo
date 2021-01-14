import React, { useState, useRef } from 'react';
import classes from './DeleteModal.module.css';
import PropTypes from 'prop-types';
import { useModalToggle } from '../../../../utils/customHooks';
import { CloseBtn, ActionBtn } from '../../../UI/Buttons/Buttons';

const DeleteModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [confirmInput, setConfirmInput] = useState('');

  const deleteHandler = () => {
    if (confirmInput !== props.confirmText) { return; }
    props.delete();
  };

  // cannot leave board if user is only admin
  // cannot delete board if user is not admin
  const canDelete = props.mode === 'leave' ? (!props.userIsAdmin || props.adminCount >= 2) : props.userIsAdmin;

  const text = props.mode === 'leave' ? 'Are you sure you want to leave this board?' :
  props.mode === 'activity' ? `Are you sure you want to delete this board's activity? This action cannot be undone.` :
  `Are you sure you want to delete this ${props.mode}? This action cannot be undone.`;

  const disabledText = props.mode === 'leave' ? 'There must be at least one other admin to leave this board.' :
  props.mode === 'activity' ? `You must be an admin to delete this board's activity.` :
  `You must be an admin to delete this ${props.mode}.`;

  return (
    <div ref={modalRef} className={classes.DeleteModal} style={props.mode === 'list' ? {left: 'calc(50% - 150px)'} : null}>
      <CloseBtn className={classes.CloseBtn} close={props.close} />
      {canDelete ?
        <>
          <div>{text}Type "{props.confirmText}" below to confirm.</div>
          <input className={classes.Input} value={confirmInput} onChange={e => setConfirmInput(e.target.value)} />
          <ActionBtn className={classes.DeleteBtn} clicked={deleteHandler}>{props.mode === 'leave' ? 'LEAVE' : 'DELETE'}</ActionBtn>
        </>
        :
        <div>{disabledText}</div>
      }
    </div>
  );
};

DeleteModal.propTypes = {
  close: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  confirmText: PropTypes.string.isRequired,
  adminCount: PropTypes.number
};

export default DeleteModal;
