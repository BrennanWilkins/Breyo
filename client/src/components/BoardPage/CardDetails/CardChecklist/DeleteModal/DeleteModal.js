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
      <CloseBtn className={classes.CloseBtn} close={props.close} />
      <div className={classes.Text}>Are you sure you want to delete the checklist '{props.title}'?</div>
      <Button className={classes.DeleteBtn} clicked={() => { props.delete(); props.close(); }}>Delete Checklist</Button>
    </div>
  );
};

DeleteModal.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  delete: PropTypes.func.isRequired
};

export default DeleteModal;
