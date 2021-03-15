import React from 'react';
import classes from './DeleteModal.module.css';
import PropTypes from 'prop-types';
import { DeleteBtn } from '../../../../../UI/Buttons/Buttons';
import ModalContainer from '../../../../../UI/ModalContainer/ModalContainer';

const DeleteModal = props => (
  <ModalContainer className={classes.Container} close={props.close} title="Delete this comment?">
    <p>Deleting a comment cannot be undone.</p>
    <DeleteBtn clicked={props.delete}>Delete Comment</DeleteBtn>
  </ModalContainer>
);

DeleteModal.propTypes = {
  close: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired
};

export default DeleteModal;
