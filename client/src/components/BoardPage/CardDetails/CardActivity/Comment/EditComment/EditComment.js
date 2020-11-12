import React, { useState, useRef, useEffect } from 'react';
import classes from './EditComment.module.css';
import { useModalToggle } from '../../../../../../utils/customHooks';
import SubmitBtns from '../../../../../UI/SubmitBtns/SubmitBtns';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';

const EditComment = props => {
  const editRef = useRef();
  const inputRef = useRef();
  useModalToggle(true, editRef, props.close);
  const [commentInput, setCommentInput] = useState(props.msg);

  useEffect(() => inputRef.current.select(), []);

  const submitHandler = e => {
    e.preventDefault();
    props.edit(commentInput);
  };

  return (
    <div ref={editRef} className={classes.Container}>
      <form onSubmit={submitHandler}>
        <TextArea ref={inputRef} maxRows="10" className={classes.Input} value={commentInput} onChange={e => setCommentInput(e.target.value)} />
        <SubmitBtns text="Save" close={props.close} />
      </form>
    </div>
  );
};

EditComment.propTypes = {
  close: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  msg: PropTypes.string.isRequired
};

export default EditComment;
