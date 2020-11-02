import React, { useState, useRef } from 'react';
import classes from './DueDateModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import Button, { CloseBtn } from '../../../UI/Buttons/Buttons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './calendarStyles.css';

const DueDateModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div ref={modalRef} className={classes.Container}>
      <div className={classes.Title}>Due Date<span className={classes.CloseBtn}><CloseBtn close={props.close} /></span></div>
      <div className={classes.DatePicker}>
        <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)}
        showPopperArrow={false} open showTimeSelect dateFormat="MM/dd/yyyy h:mm aa"
        className={classes.Input} popperModifiers={{offset: { enabled: true, offset: '-72.5px, 0px' }}} />
      </div>
      <div className={classes.Btns}>
        <span className={classes.SaveBtn}><Button>Save</Button></span>
        <span className={classes.RemoveBtn}><Button>Remove</Button></span>
      </div>
    </div>
  );
};

export default DueDateModal;
