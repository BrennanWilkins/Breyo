import React, { useState, useRef, useEffect } from 'react';
import classes from './EditChecklistTitle.module.css';
import { useModalToggle } from '../../../../../utils/customHooks';
import PropTypes from 'prop-types';
import SubmitBtns from '../../../../UI/SubmitBtns/SubmitBtns';
import TextArea from 'react-textarea-autosize';
import { editChecklistTitle } from '../../../../../store/actions';
import { connect } from 'react-redux';

const EditChecklistTitle = props => {
  const editRef = useRef();
  const inputRef = useRef();
  useModalToggle(true, editRef, props.close);
  const [titleInput, setTitleInput] = useState(props.title);

  const submitHandler = e => {
    e.preventDefault();
    props.close();
    if (!titleInput || titleInput.length > 200) { return; }
    props.edit(titleInput, props.checklistID);
  };

  useEffect(() => inputRef.current.select(), []);

  const inputHandler = e => {
    if (e.target.value.length > 200) { return; }
    setTitleInput(e.target.value);
  };

  const keyPressHandler = e => {
    if (e.key === 'Enter') { submitHandler(e); }
  };

  return (
    <div ref={editRef} className={classes.Container}>
      <form onSubmit={submitHandler}>
        <TextArea ref={inputRef} value={titleInput} onChange={inputHandler} className={classes.Input}
        onKeyPress={keyPressHandler}  />
        <SubmitBtns disabled={!titleInput} text="Save" close={props.close} />
      </form>
    </div>
  );
};

EditChecklistTitle.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  checklistID: PropTypes.string.isRequired,
  edit: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  edit: (title, checklistID) => dispatch(editChecklistTitle(title, checklistID))
});

export default connect(null, mapDispatchToProps)(EditChecklistTitle);
