import React, { useRef, useState } from 'react';
import classes from './ChecklistModal.module.css';
import PropTypes from 'prop-types';
import { useModalToggle } from '../../../../utils/customHooks';
import Button, { CloseBtn } from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import { addChecklist } from '../../../../store/actions';

const ChecklistModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [title, setTitle] = useState('');

  const addHandler = () => {
    if (title === '' || title.length > 100) { return; }
    props.close();
    props.addChecklist(title, props.cardID, props.listID, props.boardID);
  };

  return (
    <div ref={modalRef} className={classes.Container}>
      <div className={classes.Title}>Add a checklist<span className={classes.CloseBtn}><CloseBtn close={props.close} /></span></div>
      <input className={classes.Input} autoFocus value={title} onChange={e => setTitle(e.target.value)}
      placeholder="Enter a title for the checklist" />
      <span className={classes.AddBtn}><Button disabled={title === ''} clicked={addHandler}>Add</Button></span>
    </div>
  );
};

ChecklistModal.propTypes = {
  close: PropTypes.func.isRequired,
  addChecklist: PropTypes.func.isRequired,
  listID: PropTypes.string.isRequired,
  cardID: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  listID: state.lists.shownListID,
  cardID: state.lists.shownCardID,
  boardID: state.board.boardID
});

const mapDispatchToProps = dispatch => ({
  addChecklist: (title, cardID, listID, boardID) => dispatch(addChecklist(title, cardID, listID, boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChecklistModal);
