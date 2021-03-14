import React, { useState } from 'react';
import classes from './ItemDueDateModal.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeChecklistItemDueDate, removeChecklistItemDueDate } from '../../../../../store/actions';
import DatePickerModal from '../../../../UI/DatePickerModal/DatePickerModal';

const ItemDueDateModal = props => {
  const [selectedDate, setSelectedDate] = useState(props.dueDate ? new Date(props.dueDate) : new Date());

  const saveHandler = () => {
    if (!selectedDate) { return; }
    props.changeDueDate(String(selectedDate), props.itemID, props.checklistID);
    props.close();
  };

  const removeHandler = () => {
    props.close();
    props.removeDueDate(props.itemID, props.checklistID);
  };

  return (
    <DatePickerModal className={classes.Container} title="Item Due Date" close={props.close}
    changeDueDate={saveHandler} removeDueDate={removeHandler} selectedDate={selectedDate}
    onChange={date => setSelectedDate(date)} />
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
