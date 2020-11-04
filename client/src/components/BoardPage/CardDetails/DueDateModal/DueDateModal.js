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
    props.addDueDate(String(selectedDate), props.cardID, props.listID, props.boardID);
    props.close();
  };

  const removeHandler = () => {
    props.removeDueDate(props.cardID, props.listID, props.boardID);
    props.close();
  };

  return (
    <div ref={modalRef} className={classes.Container}>
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
  listID: PropTypes.string.isRequired,
  cardID: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  addDueDate: PropTypes.func.isRequired,
  removeDueDate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  dueDate: state.lists.currentCard.dueDate,
  listID: state.lists.shownListID,
  cardID: state.lists.shownCardID,
  boardID: state.board.boardID
});

const mapDispatchToProps = dispatch => ({
  addDueDate: (dueDate, cardID, listID, boardID) => dispatch(addDueDate(dueDate, cardID, listID, boardID)),
  removeDueDate: (cardID, listID, boardID) => dispatch(removeDueDate(cardID, listID, boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(DueDateModal);
