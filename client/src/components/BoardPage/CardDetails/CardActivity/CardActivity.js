import React, { useState } from 'react';
import classes from './CardActivity.module.css';
import PropTypes from 'prop-types';
import { activityIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import Button, { AccountBtn } from '../../../UI/Buttons/Buttons';
import TextArea from 'react-textarea-autosize';

const CardActivity = props => {
  const [commentInput, setCommentInput] = useState('');
  const [showCommentOptions, setShowCommentOptions] = useState(false);

  const focusHandler = () => {
    if (commentInput === '') { setShowCommentOptions(prev => !prev); }
  };

  return (
    <div>
      <div className={classes.Title}>{activityIcon}Activity</div>
      <div className={classes.AddComment}>
        <span className={classes.AccountBtn}><AccountBtn>{props.fullName.slice(0, 1)}</AccountBtn></span>
        <div className={showCommentOptions ? classes.CommentInputShow : classes.CommentInputHide}>
          <TextArea maxRows="10" className={showCommentOptions ? classes.FocusInput : classes.Input} value={commentInput} onChange={e => setCommentInput(e.target.value)}
          placeholder="Write a comment" onFocus={focusHandler} onBlur={focusHandler} />
          <div className={classes.SaveBtn}><Button disabled={commentInput === ''}>Save</Button></div>
        </div>
      </div>
    </div>
  );
};

CardActivity.propTypes = {
  fullName: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  fullName: state.auth.fullName
});

export default connect(mapStateToProps)(CardActivity);
