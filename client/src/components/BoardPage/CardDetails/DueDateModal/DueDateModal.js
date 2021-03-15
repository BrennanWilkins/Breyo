import React, { useState } from 'react';
import classes from './DueDateModal.module.css';
import PropTypes from 'prop-types';
import Button, { CloseBtn, DeleteBtn } from '../../../UI/Buttons/Buttons';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { addDueDate, removeDueDate } from '../../../../store/actions';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';

const DueDateModal = props => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(props.dueDate && props.dueDate.startDate);
  const [selectedStartDate, setSelectedStartDate] = useState((props.dueDate && props.dueDate.startDate) ? new Date(props.dueDate.startDate) : null);
  const [selectedDueDate, setSelectedDueDate] = useState(props.dueDate ? new Date(props.dueDate.dueDate) : new Date());

  const saveHandler = () => {
    const startDate = selectedStartDate ? String(selectedStartDate) : null;
    props.addDueDate(startDate, String(selectedDueDate));
    props.close();
  };

  const removeHandler = () => {
    props.close();
    if (!props.dueDate) { return; }
    props.removeDueDate();
  };

  const startDatePickerHandler = () => {
    setShowStartDatePicker(shown => !shown);
    if (showStartDatePicker) {
      setSelectedStartDate(null);
    } else {
      setSelectedStartDate((props.dueDate && props.dueDate.startDate) ? new Date(props.dueDate.startDate) : new Date());
    }
  };

  return (
    <ModalContainer className={props.fromDueDate ? classes.DueDateContainer : classes.Container} close={props.close} title="Due Date">
      <div className={classes.DatePicker}>
        {!showStartDatePicker && <div className={classes.AddStartDateBtn} onClick={startDatePickerHandler}>Add a start date</div>}
        {showStartDatePicker && <div className={classes.RemoveStartDateBtn}><CloseBtn close={startDatePickerHandler} /></div>}
        <div className={classes.Labels}>
          <div>START DATE</div>
          <div>DUE DATE</div>
        </div>
        {showStartDatePicker && <DatePicker selected={selectedStartDate} onChange={date => setSelectedStartDate(date)} selectsStart
        showPopperArrow={false} showTimeSelect dateFormat="MM/dd/yyyy h:mm aa" startDate={selectedStartDate}
        endDate={selectedDueDate} className={classes.Input} autoFocus />}
        <DatePicker selected={selectedDueDate} onChange={date => setSelectedDueDate(date)} selectsEnd
        showPopperArrow={false} showTimeSelect dateFormat="MM/dd/yyyy h:mm aa" startDate={selectedStartDate}
        endDate={selectedDueDate} className={classes.Input} />
      </div>
      <div className={classes.Btns}>
        <Button className={classes.SaveBtn} clicked={saveHandler}>Save</Button>
        <DeleteBtn clicked={removeHandler}>Remove</DeleteBtn>
      </div>
    </ModalContainer>
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
  addDueDate: (startDate, dueDate) => dispatch(addDueDate(startDate, dueDate)),
  removeDueDate: () => dispatch(removeDueDate())
});

export default connect(mapStateToProps, mapDispatchToProps)(DueDateModal);
