import React from 'react';
import classes from './DeleteModal.module.css';
import PropTypes from 'prop-types';
import Button from '../../../../UI/Buttons/Buttons';
import ModalContainer from '../../../../UI/ModalContainer/ModalContainer';

const DeleteModal = props => (
  <ModalContainer className={classes.Container} close={props.close} title={`Delete ${props.title}?`}>
    <p>Deleting a checklist cannot be undone.</p>
    <Button className={classes.DeleteBtn} clicked={() => { props.delete(); props.close(); }}>Delete Checklist</Button>
  </ModalContainer>
);

DeleteModal.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  delete: PropTypes.func.isRequired
};

export default DeleteModal;
