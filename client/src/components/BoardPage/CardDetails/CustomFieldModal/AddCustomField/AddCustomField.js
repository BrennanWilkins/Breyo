import React, { useState } from 'react';
import classes from './AddCustomField.module.css';
import PropTypes from 'prop-types';
import Select from '../../../../UI/Select/Select';
import { Input } from '../../../../UI/Inputs/Inputs';
import { ActionBtn } from '../../../../UI/Buttons/Buttons';
import { fieldIcons } from '../../../../../utils/customFieldUtils';
import { addCustomField } from '../../../../../store/actions';
import { connect } from 'react-redux';

const AddCustomField = props => {
  const [fieldType, setFieldType] = useState('Text');
  const [fieldTitle, setFieldTitle] = useState('');

  const saveHandler = () => {
    if (fieldTitle.length > 150) { return; }
    props.addCustomField(fieldType, fieldTitle);
    props.close();
  };

  return (
    <div className={classes.AddFieldContainer}>
      <Select title="Field Type" className={classes.FieldSelect}
      currentValue={<span className={fieldType === 'Date' ? classes.DateField : null}>{fieldIcons[fieldType]} {fieldType}</span>}>
        <div onClick={() => setFieldType('Text')} className={fieldType === 'Text' ? classes.ActiveOption : null}>
          <span>{fieldIcons['Text']} Text</span>
        </div>
        <div onClick={() => setFieldType('Number')} className={fieldType === 'Number' ? classes.ActiveOption : null}>
          <span>{fieldIcons['Number']} Number</span>
        </div>
        <div onClick={() => setFieldType('Checkbox')} className={fieldType === 'Checkbox' ? classes.ActiveOption : null}>
          <span>{fieldIcons['Checkbox']} Checkbox</span>
        </div>
        <div onClick={() => setFieldType('Date')} className={fieldType === 'Date' ? classes.ActiveOption : null}>
          <span className={classes.DateField}>{fieldIcons['Date']} Date</span>
        </div>
      </Select>
      <div className={classes.TitleInput}>
        <label>
          <span>Field Title</span>
          <Input value={fieldTitle} onChange={e => setFieldTitle(e.target.value)} />
        </label>
      </div>
      <ActionBtn className={classes.SaveBtn} clicked={saveHandler} disabled={!fieldTitle}>Save</ActionBtn>
    </div>
  );
};

AddCustomField.propTypes = {
  close: PropTypes.func.isRequired,
  addCustomField: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  addCustomField: (fieldType, fieldTitle) => dispatch(addCustomField(fieldType, fieldTitle))
});

export default connect(null, mapDispatchToProps)(AddCustomField);
