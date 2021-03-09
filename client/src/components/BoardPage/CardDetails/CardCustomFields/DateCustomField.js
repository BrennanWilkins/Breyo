import React, { useState } from 'react';
import classes from './CardCustomFields.module.css';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { useDidUpdate } from '../../../../utils/customHooks';

const DateCustomField = props => {
  const [selectedDate, setSelectedDate] = useState(props.value ? new Date(props.value) : null);

  useDidUpdate(() => setSelectedDate(props.value ? new Date(props.value) : null), [props.value]);

  const changeHandler = date => {
    setSelectedDate(date);
    if (date === props.value) { return; }
    if (!date) { return props.updateValue(null); }
    let formatted = date.toISOString();
    if (formatted === props.value) { return; }
    props.updateValue(formatted);
  };

  return (
    <div className={classes.DateContainer}>
      <div className={`CustomDateField ${classes.DateField}`}>
        <DatePicker selected={selectedDate} onChange={changeHandler} showTimeSelect
        showPopperArrow={false} dateFormat="MM/dd/yyyy h:mm aa" className={classes.DateInput} />
      </div>
    </div>
  );
};

DateCustomField.propTypes = {
  value: PropTypes.string,
  updateValue: PropTypes.func.isRequired
};

export default DateCustomField;
