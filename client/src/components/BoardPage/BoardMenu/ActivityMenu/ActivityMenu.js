import React, { useState, useEffect } from 'react';
import classes from './ActivityMenu.module.css';
import Action from '../../CardDetails/CardActivity/Action/Action';
import CommentAction from '../../CardDetails/CardActivity/Action/CommentAction';
import { instance as axios } from '../../../../axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ActivityMenu = props => {
  const [activity, setActivity] = useState([]);
  const [comments, setComments] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [moreLoaded, setMoreLoaded] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const fetchData = async (boardID) => {
      try {
        setLoading(true);
        const data = await axios.get(`/activity/all/board/${boardID}/0`);
        setLoading(false);
        const updatedActivity = data.data.activity.concat(props.allComments).sort((a,b) => new Date(b.date) - new Date(a.date));
        setActivity(updatedActivity);
        setComments(updatedActivity.filter(action => action.commentID));
      } catch (err) { setLoading(false); setErr(true); }
    };

    fetchData(props.boardID);
  }, [props.boardID]);

  const loadMoreHandler = async () => {
    // right now only supporting up to 200 last actions
    if (moreLoaded) { return; }
    setMoreLoaded(true);
    try {
      const data = await axios.get(`/activity/all/board/${props.boardID}/1`);
      if (data.data.activity.length === 0) { return; }
      setActivity(activity.concat(data.data.activity).sort((a,b) => new Date(b.date) - new Date(a.date)));
    } catch (err) { setErr(true); }
  };

  const data = showAll ? activity : comments;

  return (
    <div>
      <div className={classes.Btns}>
        <div className={showAll ? classes.Active : classes.Inactive} onClick={() => setShowAll(true)}>All</div>
        <div className={!showAll ? classes.Active : classes.Inactive} onClick={() => setShowAll(false)}>Comments</div>
      </div>
      {data.map(action => {
        if (action.commentID) { return <CommentAction key={action.commentID} {...action} boardID={props.boardID} />; }
        return <Action key={action._id} isBoard email={action.email} fullName={action.fullName} date={action.date}
        msg={action.boardMsg} cardID={action.cardID} listID={action.listID} boardID={action.boardID} />;
      })}
      {!loading && !moreLoaded && showAll && <div className={classes.LoadMore} onClick={loadMoreHandler}>Load more activity</div>}
      {err && <div className={classes.Err}>There was an error while fetching the activity.</div>}
    </div>
  );
};

ActivityMenu.propTypes = {
  boardID: PropTypes.string.isRequired,
  allComments: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  boardID: state.board.boardID,
  allComments: state.lists.allComments
});

export default connect(mapStateToProps)(ActivityMenu);
