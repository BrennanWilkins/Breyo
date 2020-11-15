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

  return (
    <div ref={modalRef} className={classes.DeleteModal}>
      <span className={classes.CloseBtn}><CloseBtn close={props.close} /></span>
      {props.userIsAdmin ? <>
      <div>Are you sure you want to delete {props.mode === 'activity' ? `all of this board's activity? ` : `this ${props.mode}? `}
       This action cannot be undone. Type "{props.confirmText}" below to confirm.</div>
      <input className={classes.Input} value={confirmInput} onChange={e => setConfirmInput(e.target.value)} />
      <span className={classes.DeleteBtn}><ActionBtn clicked={deleteHandler}>DELETE</ActionBtn></span></>
      : <div>You must be an admin to delete this {props.mode === 'activity' && `board's`} {props.mode}.</div>}
    </div>
  );
};

DeleteModal.propTypes = {
  close: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  confirmText: PropTypes.string.isRequired
};

export default DeleteModal;
