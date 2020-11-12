import React, { useRef } from 'react';
import classes from './DeleteModal.module.css';
import PropTypes from 'prop-types';
import { CloseBtn } from '../../../../../UI/Buttons/Buttons';
import { useModalToggle } from '../../../../../../utils/customHooks';

const DeleteModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div ref={modalRef} className={classes.Container}>
      <div className={classes.CloseBtn}><CloseBtn close={props.close} /></div>
      <div className={classes.Title}>Are you sure you want to delete this comment?</div>
      <button className={classes.DeleteBtn} onClick={props.delete}>Delete Comment</button>
    </div>
  );
};

DeleteModal.propTypes = {
  close: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired
};

export default DeleteModal;
