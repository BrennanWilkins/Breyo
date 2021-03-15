import React, { useState } from 'react';
import classes from './DeleteModal.module.css';
import PropTypes from 'prop-types';
import { DeleteBtn } from '../../../UI/Buttons/Buttons';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';
import { Input } from '../../../UI/Inputs/Inputs';

const DeleteModal = props => {
  const [confirmInput, setConfirmInput] = useState('');

  // cannot leave board if user is only admin or delete board if user is not admin
  const canDelete = props.mode === 'leave' ? (!props.userIsAdmin || props.adminCount >= 2) : props.userIsAdmin;

  const text = (
    props.mode === 'leave' ? 'Are you sure you want to leave this board?' :
    props.mode === 'activity' ? `Deleting all of the board's activity cannot be undone.` :
    `Are you sure you want to delete this ${props.mode}? This action cannot be undone.`
  );

  const disabledText = (
    props.mode === 'leave' ? 'There must be at least one other admin to leave this board.' :
    props.mode === 'activity' ? `You must be an admin to delete this board's activity.` :
    `You must be an admin to delete this ${props.mode}.`
  );

  const modalTitle = (
    props.mode === 'leave' ? 'Leave this board' :
    props.mode === 'activity' ? 'Delete activity' :
    props.mode === 'list' ? 'Delete this list' :
    'Delete this board'
  );

  return (
    <ModalContainer close={props.close} className={`${classes.DeleteModal} ${props.mode === 'list' ? classes.DeleteListModal : ''}`} title={modalTitle} addMargin>
      {canDelete ?
        <>
          <p>{text} Type "{props.confirmText}" below to confirm.</p>
          <Input className={classes.Input} value={confirmInput} onChange={e => setConfirmInput(e.target.value)} />
          <DeleteBtn disabled={confirmInput !== props.confirmText} className={classes.DeleteBtn} clicked={props.delete}>
            {props.mode === 'leave' ? 'LEAVE' : 'DELETE'}
          </DeleteBtn>
        </>
        :
        <p>{disabledText}</p>
      }
    </ModalContainer>
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
