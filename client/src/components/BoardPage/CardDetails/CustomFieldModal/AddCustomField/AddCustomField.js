import React, { useState } from 'react';
import classes from './AddCustomField.module.css';
import PropTypes from 'prop-types';
import Select from '../../../../UI/Select/Select';
import { Input } from '../../../../UI/Inputs/Inputs';
import { ActionBtn } from '../../../../UI/Buttons/Buttons';
import { textFieldIcon, numberFieldIcon, dateFieldIcon, checkboxFieldIcon } from '../../../../UI/icons';

const fields = {
  'Text': <span className={classes.Field}>{textFieldIcon} Text</span>,
  'Number': <span className={classes.Field}>{numberFieldIcon} Number</span>,
  'Checkbox': <span className={classes.Field}>{checkboxFieldIcon} Checkbox</span>,
  'Date': <span className={`${classes.Field} ${classes.DateField}`}>{dateFieldIcon} Date</span>
};

const AddCustomField = props => {
  const [fieldType, setFieldType] = useState('Text');
  const [fieldTitle, setFieldTitle] = useState('');

  const saveHandler = () => {
    props.close();
  };

  return (
    <div className={classes.AddFieldContainer}>
      <Select title="Field Type" currentValue={fields[fieldType]} className={classes.FieldSelect}>
        <div onClick={() => setFieldType('Text')} className={fieldType === 'Text' ? classes.ActiveOption : null}>{fields['Text']}</div>
        <div onClick={() => setFieldType('Number')} className={fieldType === 'Number' ? classes.ActiveOption : null}>{fields['Number']}</div>
        <div onClick={() => setFieldType('Checkbox')} className={fieldType === 'Checkbox' ? classes.ActiveOption : null}>{fields['Checkbox']}</div>
        <div onClick={() => setFieldType('Date')} className={fieldType === 'Date' ? classes.ActiveOption : null}>{fields['Date']}</div>
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
  close: PropTypes.func.isRequired
};

export default AddCustomField;
