import React, { useState, useEffect } from 'react';
import classes from './CardActivity.module.css';
import AddComment from './AddComment/AddComment';
import { activityIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Comment from './Comment/Comment';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { getRecentCardActivity, resetCardActivity, getAllCardActivity } from '../../../../store/actions';
import Action from './Action/Action';
import AuthSpinner from '../../../UI/AuthSpinner/AuthSpinner';

const CardActivity = props => {
  const [data, setData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [allShown, setAllShown] = useState(false);

  useEffect(() => {
    if (!showDetails) {
      props.resetCardActivity();
      return setData(props.comments);
    }
    props.getRecentCardActivity();
  }, [showDetails]);

  useEffect(() => {
    if (showDetails) { setData(props.comments.concat(props.activity).sort((a, b) => new Date(b.date) - new Date(a.date))); }
    else { setData(props.comments); }
  }, [props.activity, props.comments, showDetails]);

  const showAllHandler = () => {
    setAllShown(true);
    props.getAllCardActivity();
  };

  return (
    <div>
      <div className={classes.Title}>
        <div>{activityIcon}Activity</div>
        <span className={classes.ShowDetailBtn}>
          <ActionBtn clicked={() => setShowDetails(prev => !prev)}>{showDetails ? 'Hide Details' : 'Show Details'}</ActionBtn>
        </span>
      </div>
      <AddComment />
      {data.map(datum => {
        if (datum.commentID) { return <Comment key={datum.commentID} {...datum} userComment={props.userEmail === datum.email} />; }
        else { return <Action key={datum._id} email={datum.email} fullName={datum.fullName} msg={datum.msg} date={datum.date} />; }
      })}
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
  getAllCardActivity: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  comments: state.lists.currentCard.comments,
  userEmail: state.auth.email,
  activity: state.activity.cardActivity,
  isLoading: state.activity.cardActivityLoading
});

const mapDispatchToProps = dispatch => ({
  getRecentCardActivity: () => dispatch(getRecentCardActivity()),
  resetCardActivity: () => dispatch(resetCardActivity()),
  getAllCardActivity: () => dispatch(getAllCardActivity())
});

export default connect(mapStateToProps, mapDispatchToProps)(CardActivity);
