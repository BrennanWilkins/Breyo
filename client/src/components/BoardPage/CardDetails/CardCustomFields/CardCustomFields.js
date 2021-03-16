import React from 'react';
import classes from './CardCustomFields.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateCustomFieldValue } from '../../../../store/actions';
import { customFieldIcon } from '../../../UI/icons';
import { fieldIcons } from '../../../../utils/customFieldUtils';
import TextCustomField from './TextCustomField';
import CheckboxCustomField from './CheckboxCustomField';
import DateCustomField from './DateCustomField';

const CardCustomFields = props => (
  <div>
    <div className={classes.Title}>{customFieldIcon}Custom Fields</div>
    <div className={classes.Fields}>
      {props.allCustomFields.map(fieldID => {
        const matchingField = props.customFields.find(field => field.fieldID === fieldID);
        if (!matchingField) { return null; }
        const { fieldTitle, fieldType } = props.customFieldsByID[fieldID];
        const value = matchingField.value;
        return (
          <div key={fieldID} className={classes.Field}>
            <div className={`${classes.FieldTitle} ${fieldType === 'Date' ? classes.DateTitle : ''}`}>
              {fieldIcons[fieldType]}
              <span className={classes.TitleText}>{fieldTitle}</span>
            </div>
            {
              fieldType === 'Text' ? <TextCustomField value={value} updateValue={val => props.updateValue(fieldID, val)} /> :
              fieldType === 'Number' ? <TextCustomField isNumber value={value} updateValue={val => props.updateValue(fieldID, val)} /> :
              fieldType === 'Checkbox' ? <CheckboxCustomField value={value} updateValue={val => props.updateValue(fieldID, val)} /> :
              <DateCustomField value={value} updateValue={val => props.updateValue(fieldID, val)} title={fieldTitle} />
            }
          </div>
        );
      })}
    </div>
  </div>
);

CardCustomFields.propTypes = {
  customFields: PropTypes.array.isRequired,
  updateValue: PropTypes.func.isRequired,
  customFieldsByID: PropTypes.object.isRequired,
  allCustomFields: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  customFieldsByID: state.board.customFields.byID,
  allCustomFields: state.board.customFields.allIDs
});

const mapDispatchToProps = dispatch => ({
  updateValue: (fieldID, value) => dispatch(updateCustomFieldValue(fieldID, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(CardCustomFields);
