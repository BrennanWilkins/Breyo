import React, { useState } from 'react';
import classes from './CardActivity.module.css';
import AddComment from './AddComment/AddComment';
import { activityIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Comment from './Comment/Comment';

const CardActivity = props => {
  return (
    <div>
      <div className={classes.Title}>{activityIcon}Activity</div>
      <AddComment />
      {props.comments.map(comment => <Comment key={comment.commentID} {...comment} userComment={props.userEmail === comment.email} />)}
    </div>
  );
};

CardActivity.propTypes = {
  comments: PropTypes.array.isRequired,
  userEmail: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  comments: state.lists.currentCard.comments,
  userEmail: state.auth.email
});

export default connect(mapStateToProps)(CardActivity);
