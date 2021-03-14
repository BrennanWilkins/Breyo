import React, { useState } from 'react';
import classes from './ItemDueDateModal.module.css';
import PropTypes from 'prop-types';
import ModalContainer from '../../../../UI/ModalContainer/ModalContainer';
import Button from '../../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import { changeChecklistItemDueDate, removeChecklistItemDueDate } from '../../../../../store/actions';
import DatePicker from 'react-datepicker';

const ItemDueDateModal = props => {
  const [selectedDate, setSelectedDate] = useState(props.dueDate ? new Date(props.dueDate) : new Date());

  const saveHandler = () => {
    props.changeDueDate(String(selectedDate), props.itemID, props.checklistID);
    props.close();
  };

  const removeHandler = () => {
    if (!props.dueDate) { return; }
    props.close();
    props.removeDueDate(props.itemID, props.checklistID);
  };

  return (
    <ModalContainer className={classes.Container} title="Item Due Date" close={props.close}>
      <div className={`ItemDatePicker ${classes.DatePicker}`}>
        <DatePicker selected={selectedDate} open onChange={date => setSelectedDate(date)}
        showPopperArrow={false} dateFormat="MM/dd/yyyy" className={classes.Input} autoFocus />
        <div className={classes.Btns}>
          <span className={classes.SaveBtn}><Button clicked={saveHandler}>Save</Button></span>
          <span className={classes.RemoveBtn}><Button clicked={removeHandler}>Remove</Button></span>
        </div>
      </div>
    </ModalContainer>
  );
};

ItemDueDateModal.propTypes = {
  close: PropTypes.func.isRequired,
  changeDueDate: PropTypes.func.isRequired,
  removeDueDate: PropTypes.func.isRequired,
  itemID: PropTypes.string.isRequired,
  checklistID: PropTypes.string.isRequired,
  dueDate: PropTypes.string
};

const mapDispatchToProps = dispatch => ({
  changeDueDate: (dueDate, itemID, checklistID) => dispatch(changeChecklistItemDueDate(dueDate, itemID, checklistID)),
  removeDueDate: (itemID, checklistID) => dispatch(removeChecklistItemDueDate(itemID, checklistID))
});

export default connect(null, mapDispatchToProps)(ItemDueDateModal);
