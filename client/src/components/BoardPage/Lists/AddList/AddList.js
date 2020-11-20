import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './AddList.module.css';
import { plusIcon } from '../../../UI/icons';
import { useModalToggle } from '../../../../utils/customHooks';
import { connect } from 'react-redux';
import { addList } from '../../../../store/actions';
import SubmitBtns from '../../../UI/SubmitBtns/SubmitBtns';

const AddList = props => {
  const [showForm, setShowForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const formRef = useRef();
  const inputRef = useRef();
  useModalToggle(showForm, formRef, () => setShowForm(false));

  const resetState = () => {
    setShowForm(false);
    setNewListTitle('');
  };

  const submitHandler = e => {
    e.preventDefault();
    if (newListTitle === '' || newListTitle.length > 200) { return resetState(); }
    props.addList(newListTitle, props.boardID);
    resetState();
  };

  const showHandler = () => {
    setShowForm(true);
    setTimeout(() => inputRef.current.focus(), 250);
  };

  return (
    <div className={classes.Container}>
      {!showForm && <div className={classes.AddBtn} onClick={showHandler}>{plusIcon}{props.listCount === 0 ? 'Add a list' : 'Add another list'}</div>}
      <form ref={formRef} className={showForm ? classes.ShowForm : classes.HideForm} onSubmit={submitHandler}>
        <input className={classes.Input} ref={inputRef} value={newListTitle} onChange={e => setNewListTitle(e.target.value)}
        placeholder="Enter list title" />
        <SubmitBtns text="Add List" close={() => setShowForm(false)} />
      </form>
    </div>
  );
};

AddList.propTypes = {
  listCount: PropTypes.number.isRequired,
  boardID: PropTypes.string.isRequired,
  addList: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  addList: (title, boardID) => dispatch(addList(title, boardID))
});

export default connect(null, mapDispatchToProps)(AddList);
