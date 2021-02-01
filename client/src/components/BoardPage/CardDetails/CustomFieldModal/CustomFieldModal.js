import React, { useState } from 'react';
import classes from './CustomFieldModal.module.css';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';
import PropTypes from 'prop-types';
import { plusIcon } from '../../../UI/icons';
import { BackBtn } from '../../../UI/Buttons/Buttons';
import AddCustomField from './AddCustomField/AddCustomField';
import { connect } from 'react-redux';
import { xIcon } from '../../../UI/icons';
import { fieldIcons } from '../../../../utils/customFieldUtils';
import { deleteCustomField } from '../../../../store/actions';

const CustomFieldModal = props => {
  const [showAddField, setShowAddField] = useState(false);

  return (
    <ModalContainer close={props.close} className={classes.Container} title="Custom Fields">
      {showAddField && <div className={classes.BackBtn}><BackBtn back={() => setShowAddField(false)} /></div>}
      {showAddField ?
        <AddCustomField close={() => setShowAddField(false)} />
        :
        <>
          {props.customFields.map(field => (
            <div key={field.fieldID} className={`${classes.Option} ${field.fieldType === 'Date' ? classes.DateField : ''}`}>
              {fieldIcons[field.fieldType]}
              {field.fieldTitle}
              <div className={classes.DeleteBtn} onClick={() => props.deleteField(field.fieldID)}>{xIcon}</div>
            </div>
          ))}
          <div className={`${classes.Option} ${classes.AddBtn}`} onClick={() => setShowAddField(true)}>{plusIcon}New Field</div>
        </>
      }
    </ModalContainer>
  );
};

CustomFieldModal.propTypes = {
  close: PropTypes.func.isRequired,
  customFields: PropTypes.array.isRequired,
  deleteField: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  customFields: state.lists.currentCard.customFields
});

const mapDispatchToProps = dispatch => ({
  deleteField: fieldID => dispatch(deleteCustomField(fieldID))
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomFieldModal);
