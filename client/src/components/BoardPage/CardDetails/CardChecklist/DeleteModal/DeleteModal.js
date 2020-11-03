import React, { useRef } from 'react';
import classes from './DeleteModal.module.css';
import { useModalToggle } from '../../../../../utils/customHooks';
import PropTypes from 'prop-types';
import Button, { CloseBtn } from '../../../../UI/Buttons/Buttons';

const DeleteModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div ref={modalRef} className={classes.Container}>
      <span className={classes.CloseBtn}><CloseBtn close={props.close} /></span>
      <div className={classes.Body}>Are you sure you want to delete the checklist '{props.title}'?</div>
      <span className={classes.DeleteBtn}><Button clicked={() => { props.delete(); props.close(); }}>Delete Checklist</Button></span>
    </div>
  );
};

DeleteModal.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  delete: PropTypes.func.isRequired
};

export default DeleteModal;
