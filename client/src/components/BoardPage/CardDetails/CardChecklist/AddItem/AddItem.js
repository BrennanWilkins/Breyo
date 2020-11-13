import React, { useState, useRef } from 'react';
import classes from './AddItem.module.css';
import TextArea from 'react-textarea-autosize';
import { useModalToggle } from '../../../../../utils/customHooks';
import PropTypes from 'prop-types';
import SubmitBtns from '../../../../UI/SubmitBtns/SubmitBtns';
import { connect } from 'react-redux';
import { addChecklistItem } from '../../../../../store/actions';

const AddItem = props => {
  const addRef = useRef();
  useModalToggle(true, addRef, props.close);
  const [itemTitle, setItemTitle] = useState('');

  const addHandler = e => {
    e.preventDefault();
    if (itemTitle === '' || itemTitle.length > 200) { return; }
    setItemTitle('');
    props.addItem(itemTitle, props.checklistID, props.cardID, props.listID, props.boardID);
  };

  const keyPressHandler = e => { if (e.key === 'Enter') { addHandler(e); } };

  return (
    <div ref={addRef} className={classes.Container}>
      <form onSubmit={addHandler}>
        <TextArea maxRows="5" value={itemTitle} onChange={e => setItemTitle(e.target.value)} className={classes.Input}
        onKeyPress={keyPressHandler} autoFocus placeholder="Add an item" />
        <SubmitBtns disabled={itemTitle === ''} close={props.close} text="Add" />
      </form>
    </div>
  );
};

AddItem.propTypes = {
  close: PropTypes.func.isRequired,
  checklistID: PropTypes.string.isRequired,
  cardID: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  addItem: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  addItem: (title, checklistID, cardID, listID, boardID) => dispatch(addChecklistItem(title, checklistID, cardID, listID, boardID))
});

export default connect(null, mapDispatchToProps)(AddItem);
