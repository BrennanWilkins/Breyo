import React from 'react';
import classes from './CustomFieldModal.module.css';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';
import PropTypes from 'prop-types';
import { plusIcon } from '../../../UI/icons';

const CustomFieldModal = props => {
  return (
    <ModalContainer close={props.close} className={classes.Container} title="Custom Fields">
      <div className={classes.AddBtn}>{plusIcon}New Field</div>
    </ModalContainer>
  );
};

CustomFieldModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default CustomFieldModal;
