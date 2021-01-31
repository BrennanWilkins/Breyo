import React, { useState } from 'react';
import classes from './CustomFieldModal.module.css';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';
import PropTypes from 'prop-types';
import { plusIcon } from '../../../UI/icons';
import { BackBtn } from '../../../UI/Buttons/Buttons';
import AddCustomField from './AddCustomField/AddCustomField';

const CustomFieldModal = props => {
  const [showAddField, setShowAddField] = useState(false);

  return (
    <ModalContainer close={props.close} className={classes.Container} title="Custom Fields">
      {showAddField && <div className={classes.BackBtn}><BackBtn back={() => setShowAddField(false)} /></div>}
      {showAddField ?
        <AddCustomField close={() => setShowAddField(false)} />
        :
        <div className={classes.AddBtn} onClick={() => setShowAddField(true)}>{plusIcon}New Field</div>
      }
    </ModalContainer>
  );
};

CustomFieldModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default CustomFieldModal;
