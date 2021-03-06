import React, { useState } from 'react';
import classes from './DatePickerModal.module.css';
import PropTypes from 'prop-types';
import ModalContainer from '../ModalContainer/ModalContainer';
import Button, { DeleteBtn } from '../Buttons/Buttons';
import DatePicker from 'react-datepicker';
import './calendarStyles.css';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerModal = props => (
  <ModalContainer className={`${classes.Container} ${props.className}`} title={props.title} close={props.close}>
    <div className={`NoStartDatePicker ${classes.DatePicker}`}>
      <DatePicker selected={props.selectedDate} open onChange={props.onChange} showTimeSelect={props.showTimeSelect}
      showPopperArrow={false} dateFormat={props.showTimeSelect ? 'MM/dd/yyyy h:mm aa' : 'MM/dd/yyyy'} className={classes.Input} autoFocus />
      <div className={classes.Btns}>
        <Button className={classes.SaveBtn} clicked={props.changeDueDate}>Save</Button>
        <DeleteBtn clicked={props.removeDueDate}>Remove</DeleteBtn>
      </div>
    </div>
  </ModalContainer>
);

DatePickerModal.propTypes = {
  close: PropTypes.func.isRequired,
  changeDueDate: PropTypes.func.isRequired,
  removeDueDate: PropTypes.func.isRequired,
  dueDate: PropTypes.string,
  title: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  showTimeSelect: PropTypes.bool,
  selectedDate: PropTypes.instanceOf(Date)
};

export default DatePickerModal;
