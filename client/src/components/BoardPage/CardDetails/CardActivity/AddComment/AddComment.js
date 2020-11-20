import React, { useState, useRef } from 'react';
import classes from './AddComment.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button, { AccountBtn } from '../../../../UI/Buttons/Buttons';
import TextArea from 'react-textarea-autosize';
import { addComment } from '../../../../../store/actions';
import { useModalToggleMultiple } from '../../../../../utils/customHooks';

const AddComment = props => {
  const commentRef = useRef();
  const accntRef = useRef();
  const [commentInput, setCommentInput] = useState('');
  const [showCommentOptions, setShowCommentOptions] = useState(false);
  useModalToggleMultiple(showCommentOptions, [commentRef, accntRef], () => setShowCommentOptions(false));

  const addCommentHandler = () => {
    if (commentInput === '' || commentInput.length > 400) { return; }
    props.addComment(commentInput);
    setShowCommentOptions(false);
    setCommentInput('');
  };

  return (
    <div className={classes.AddComment}>
      <span ref={accntRef} className={classes.AccountBtn}><AccountBtn clicked={() => setShowCommentOptions(true)}>{props.fullName.slice(0, 1)}</AccountBtn></span>
      <div ref={commentRef} className={showCommentOptions ? classes.CommentInputShow : classes.CommentInputHide}>
        <TextArea maxRows="20" className={showCommentOptions ? classes.FocusInput : classes.Input} value={commentInput} onChange={e => setCommentInput(e.target.value)}
        placeholder="Write a comment" onFocus={() => setShowCommentOptions(true)} />
        <div className={classes.SaveBtn}><Button disabled={commentInput === ''} clicked={addCommentHandler}>Save</Button></div>
      </div>
    </div>
  );
};

AddComment.propTypes = {
  fullName: PropTypes.string.isRequired,
  addComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  fullName: state.auth.fullName
});

const mapDispatchToProps = dispatch => ({
  addComment: msg => dispatch(addComment(msg))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddComment);
