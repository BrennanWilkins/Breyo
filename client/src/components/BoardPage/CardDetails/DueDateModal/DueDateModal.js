import React, { useState, useRef } from 'react';
import classes from './DueDateModal.module.css';
import PropTypes from 'prop-types';
import { useModalToggle } from '../../../../utils/customHooks';
import Button, { CloseBtn } from '../../../UI/Buttons/Buttons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './calendarStyles.css';
import { connect } from 'react-redux';
import { addDueDate, removeDueDate } from '../../../../store/actions';

const DueDateModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [selectedDate, setSelectedDate] = useState(props.dueDate ? new Date(props.dueDate.dueDate) : new Date());

  const saveHandler = () => {
    props.addDueDate(String(selectedDate));
    props.close();
  };

  const removeHandler = () => {
    props.close();
    if (!props.dueDate) { return; }
    props.removeDueDate();
  };

  return (
    <div ref={modalRef} className={props.fromDueDate ? classes.DueDateContainer : classes.Container}>
      <div className={classes.Title}>Due Date<span className={classes.CloseBtn}><CloseBtn close={props.close} /></span></div>
      <div className={classes.DatePicker}>
        <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)}
        showPopperArrow={false} open showTimeSelect dateFormat="MM/dd/yyyy h:mm aa"
        className={classes.Input} popperModifiers={{offset: { enabled: true, offset: '-72.5px, 0px' }}} />
      </div>
      <div className={classes.Btns}>
        <span className={classes.SaveBtn}><Button clicked={saveHandler}>Save</Button></span>
        <span className={classes.RemoveBtn}><Button clicked={removeHandler}>Remove</Button></span>
      </div>
    </div>
  );
};

DueDateModal.propTypes = {
  close: PropTypes.func.isRequired,
  dueDate: PropTypes.object,
  addDueDate: PropTypes.func.isRequired,
  removeDueDate: PropTypes.func.isRequired,
  fromDueDate: PropTypes.bool
};

const mapStateToProps = state => ({
  dueDate: state.lists.currentCard.dueDate
});

const mapDispatchToProps = dispatch => ({
  addDueDate: dueDate => dispatch(addDueDate(dueDate)),
  removeDueDate: () => dispatch(removeDueDate())
});

export default connect(mapStateToProps, mapDispatchToProps)(DueDateModal);
