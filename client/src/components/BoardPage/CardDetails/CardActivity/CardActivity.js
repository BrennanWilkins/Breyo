import React, { useState, useEffect } from 'react';
import classes from './CardActivity.module.css';
import AddComment from './AddComment/AddComment';
import { activityIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Comment from './Comment/Comment';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { getRecentCardActivity, resetCardActivity, getAllCardActivity } from '../../../../store/actions';
import Action from '../../../UI/Action/Action';
import AuthSpinner from '../../../UI/AuthSpinner/AuthSpinner';

const CardActivity = props => {
  const [showDetails, setShowDetails] = useState(false);
  const [allShown, setAllShown] = useState(false);

  useEffect(() => {
    // reset card activity on closing card details
    return () => props.resetCardActivity();
  }, []);

  const showDetailsHandler = () => {
    // fetch recent card activity on show details else clear card activity
    if (!showDetails) { props.getRecentCardActivity(); }
    else { props.resetCardActivity(); }
    setShowDetails(prev => !prev);
  };

  const showAllHandler = () => {
    setAllShown(true);
    props.getAllCardActivity();
  };

  return (
    <div>
      <div className={classes.Title}>
        <div>{activityIcon}Activity</div>
        <ActionBtn clicked={showDetailsHandler}>{showDetails ? 'Hide Details' : 'Show Details'}</ActionBtn>
      </div>
      <AddComment />
      {showDetails ?
        props.activity.map(action => {
          if (action.commentID) { return <Comment key={action.commentID} {...action} userComment={props.userEmail === action.email} avatar={props.avatars[action.email]} />; }
          else { return <Action key={action._id} email={action.email} fullName={action.fullName} msg={action.msg} date={action.date} avatar={props.avatars[action.email]} />; }
        }) :
        props.comments.map(comment => (
          <Comment key={comment.commentID} {...comment} userEmail={props.userEmail} userComment={props.userEmail === comment.email} avatar={props.avatars[comment.email]} />
        ))}
      {props.isLoading && <div className={classes.Spinner}><AuthSpinner /></div>}
      {!props.isLoading && showDetails && !allShown && <div className={classes.ViewAll} onClick={showAllHandler}>Show all actions...</div>}
    </div>
  );
};

CardActivity.propTypes = {
  comments: PropTypes.array.isRequired,
  userEmail: PropTypes.string.isRequired,
  activity: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getRecentCardActivity: PropTypes.func.isRequired,
  resetCardActivity: PropTypes.func.isRequired,
  getAllCardActivity: PropTypes.func.isRequired,
  avatars: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  comments: state.lists.currentCard.comments,
  userEmail: state.user.email,
  activity: state.activity.cardActivity,
  isLoading: state.activity.cardActivityLoading,
  avatars: state.board.avatars
});

const mapDispatchToProps = dispatch => ({
  getRecentCardActivity: () => dispatch(getRecentCardActivity()),
  resetCardActivity: () => dispatch(resetCardActivity()),
  getAllCardActivity: () => dispatch(getAllCardActivity())
});

export default connect(mapStateToProps, mapDispatchToProps)(CardActivity);
