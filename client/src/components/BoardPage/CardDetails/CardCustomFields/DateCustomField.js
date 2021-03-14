import React, { useState, useMemo, useRef } from 'react';
import classes from './CardCustomFields.module.css';
import PropTypes from 'prop-types';
import DatePickerModal from '../../../UI/DatePickerModal/DatePickerModal';
import formatDate from '../../../../utils/formatDate';

const DateCustomField = props => {
  const [selectedDate, setSelectedDate] = useState(props.value ? new Date(props.value) : new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const shownDate = useMemo(() => props.value ? formatDate(new Date(props.value)) : null, [props.value]);
  const valueRef = useRef();
  const [showModalDown, setShowModalDown] = useState(false);

  const showDateModalHandler = () => {
    if (valueRef.current.getBoundingClientRect().top < 390) {
      setShowModalDown(true);
    }
    setShowDateModal(true);
    setSelectedDate(props.value ? new Date(props.value) : new Date());
  };

  const saveHandler = () => {
    if (!selectedDate) { return; }
    props.updateValue(String(selectedDate));
    setShowDateModal(false);
  };

  const removeHandler = () => {
    props.updateValue(null);
    setShowDateModal(false);
  };

  return (
    <div style={showModalDown ? null : { position: 'relative' }}>
      <div ref={valueRef} className={classes.DateValue} onClick={showDateModalHandler}>{shownDate}</div>
      {showDateModal &&
        <DatePickerModal className={showModalDown ? classes.DateModalDown : classes.DateModalUp}
        title={props.title} close={() => setShowDateModal(false)}
        changeDueDate={saveHandler} removeDueDate={removeHandler} selectedDate={selectedDate}
        onChange={date => setSelectedDate(date)} showTimeSelect />
      }
    </div>
  );
};

DateCustomField.propTypes = {
  value: PropTypes.string,
  updateValue: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default DateCustomField;
