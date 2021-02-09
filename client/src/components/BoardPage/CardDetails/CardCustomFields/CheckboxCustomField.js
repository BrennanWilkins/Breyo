import React from 'react';
import classes from './CardCustomFields.module.css';
import PropTypes from 'prop-types';
import { Checkbox } from '../../../UI/Inputs/Inputs';

const CheckboxCustomField = props => (
  <div className={classes.Checkbox}>
    <Checkbox checked={props.value} clicked={() => props.updateValue(!props.value)} />
  </div>
);

CheckboxCustomField.propTypes = {
  value: PropTypes.bool,
  updateValue: PropTypes.func.isRequired
};

export default CheckboxCustomField;
