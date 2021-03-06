import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './AddCard.module.css';
import TextArea from 'react-textarea-autosize';
import { useModalToggle } from '../../../../utils/customHooks';
import SubmitBtns from '../../../UI/SubmitBtns/SubmitBtns';
import { connect } from 'react-redux';
import { addCard } from '../../../../store/actions';

const AddCard = props => {
  const [cardTitle, setCardTitle] = useState('');
  const addRef = useRef();
  const inputRef = useRef();
  useModalToggle(true, addRef, props.close);

  useEffect(() => inputRef.current.focus(), []);

  const submitHandler = e => {
    e.preventDefault();
    if (!cardTitle || cardTitle.length > 200) { return; }
    props.addCard(cardTitle, props.listID);
    setCardTitle('');
  };

  const keyPressHandler = e => { if (e.key === 'Enter') { submitHandler(e); } };

  return (
    <div ref={addRef}>
      <form onSubmit={submitHandler}>
        <TextArea ref={inputRef} className={classes.Input} value={cardTitle} onChange={e => setCardTitle(e.target.value)}
        minRows="3" maxRows="10" placeholder="Enter a title for this card" onKeyPress={keyPressHandler} />
        <SubmitBtns text="Add Card" close={props.close} />
      </form>
    </div>
  );
};

AddCard.propTypes = {
  close: PropTypes.func.isRequired,
  listID: PropTypes.string.isRequired,
  addCard: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  addCard: (title, listID) => dispatch(addCard(title, listID))
});

export default connect(null, mapDispatchToProps)(AddCard);
