import React, { useState, useEffect } from 'react';
import classes from './ActivityMenu.module.css';
import Action from '../../CardDetails/CardActivity/Action/Action';
import CommentAction from '../../CardDetails/CardActivity/Action/CommentAction';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchFirstPageBoardActivity, fetchAllBoardActivity,
  setAllBoardActivityShown, resetAllBoardActivity } from '../../../../store/actions';

const ActivityMenu = props => {
  const [showAll, setShowAll] = useState(true);
  const [moreLoaded, setMoreLoaded] = useState(false);

  useEffect(() => {
    props.fetchFirstPage();
    props.setShown();

    return () => props.reset();
  }, []);

  const loadMoreHandler = () => {
    // return if all activity already loaded
    if (moreLoaded) { return; }
    setMoreLoaded(true);
    if (props.allBoardActivity.length < 100) { return; }
    props.fetchAll();
  };

  return (
    <div>
      <div className={classes.Btns}>
        <div className={showAll ? classes.Active : classes.Inactive} onClick={() => setShowAll(true)}>All</div>
        <div className={!showAll ? classes.Active : classes.Inactive} onClick={() => setShowAll(false)}>Comments</div>
      </div>
      {showAll ?
        props.allBoardActivity.map(action => {
          if (action.commentID) { return <CommentAction key={action.commentID} {...action} boardID={props.boardID} />; }
          return <Action key={action._id} isBoard email={action.email} fullName={action.fullName} date={action.date}
          msg={action.boardMsg} cardID={action.cardID} listID={action.listID} boardID={action.boardID} />;
        }) :
        props.allComments.map(comment => <CommentAction key={comment.commentID} {...comment} boardID={props.boardID} />)}
      {!props.isLoading && !moreLoaded && showAll && <div className={classes.LoadMore} onClick={loadMoreHandler}>Load more activity</div>}
      {props.hasErr && <div className={classes.Err}>There was an error while fetching the activity.</div>}
    </div>
  );
};

ActivityMenu.propTypes = {
  boardID: PropTypes.string.isRequired,
  allComments: PropTypes.array.isRequired,
  allBoardActivity: PropTypes.array.isRequired,
  fetchFirstPage: PropTypes.func.isRequired,
  fetchAll: PropTypes.func.isRequired,
  setShown: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasErr: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  boardID: state.board.boardID,
  allComments: state.activity.allComments,
  allBoardActivity: state.activity.allBoardActivity,
  isLoading: state.activity.allBoardActivityLoading,
  hasErr: state.activity.allBoardActivityErr
});

const mapDispatchToProps = dispatch => ({
  fetchFirstPage: () => dispatch(fetchFirstPageBoardActivity()),
  fetchAll: () => dispatch(fetchAllBoardActivity()),
  setShown: () => dispatch(setAllBoardActivityShown()),
  reset: () => dispatch(resetAllBoardActivity())
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityMenu);
