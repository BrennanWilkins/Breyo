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
    if (!commentInput || commentInput.length > 400) { return; }
    props.addComment(commentInput);
    setShowCommentOptions(false);
    setCommentInput('');
  };

  return (
    <div className={classes.AddComment}>
      <span ref={accntRef}>
        <AccountBtn className={classes.AccountBtn} avatar={props.avatar} clicked={() => setShowCommentOptions(true)}>{props.fullName[0]}</AccountBtn>
      </span>
      <div ref={commentRef} className={showCommentOptions ? classes.CommentInputShow : classes.CommentInputHide}>
        <TextArea maxRows="20" className={showCommentOptions ? classes.FocusInput : classes.Input} value={commentInput} onChange={e => setCommentInput(e.target.value)}
        placeholder="Write a comment" onFocus={() => setShowCommentOptions(true)} />
        <Button className={classes.SaveBtn} disabled={!commentInput} clicked={addCommentHandler}>Save</Button>
      </div>
    </div>
  );
};

AddComment.propTypes = {
  fullName: PropTypes.string.isRequired,
  addComment: PropTypes.func.isRequired,
  avatar: PropTypes.string
};

const mapStateToProps = state => ({
  fullName: state.user.fullName,
  avatar: state.user.avatar
});

const mapDispatchToProps = dispatch => ({
  addComment: msg => dispatch(addComment(msg))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddComment);
