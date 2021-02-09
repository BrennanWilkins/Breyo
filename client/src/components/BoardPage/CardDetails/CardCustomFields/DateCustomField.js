import React, { useState } from 'react';
import classes from './CardCustomFields.module.css';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';

const DateCustomField = props => {
  const [selectedDate, setSelectedDate] = useState(props.value ? new Date(props.value) : new Date());

  return (
    <div className={classes.DateContainer}>
      <div className={`CustomDateField ${classes.DateField}`}>
        <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} showTimeSelect
        showPopperArrow={false} showTimeSelect dateFormat="MM/dd/yyyy h:mm aa" className={classes.DateInput} />
      </div>
    </div>
  );
};

DateCustomField.propTypes = {
  value: PropTypes.string,
  updateValue: PropTypes.func.isRequired
};

export default DateCustomField;
