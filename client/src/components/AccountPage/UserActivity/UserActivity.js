import React, { useState, useEffect } from 'react';
import classes from './UserActivity.module.css';
import { activityIcon } from '../../UI/icons';
import Action from '../../UI/Action/Action';
import CommentAction from '../../UI/Action/CommentAction';
import Spinner from '../../UI/AuthSpinner/AuthSpinner';
import { instance as axios } from '../../../axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const UserActivity = props => {
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [page, setPage] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    // cache all board titles for faster board title lookup when fetching activities
    const boardTitles = {};
    for (let board of props.boards) { boardTitles[board.boardID] = board.title; }

    const fetchActivity = async page => {
      try {
        setLoading(true);
        const res = await axios.get(`/activity/myActivity/${page}`);
        setLoading(false);
        const data = res.data.activity.map(action => ({ ...action, boardTitle: boardTitles[action.boardID] }));
        setUserActivity(userActivity.concat(data));
        if (res.data.activity.length < 100) { setAllLoaded(true); }
      } catch (err) {
        setLoading(false);
        setErr(true);
      }
    };

    fetchActivity(page);
  }, [page]);

  return (
    <div className={classes.Container}>
      <div className={classes.Content}>
        <div className={classes.Title}>{activityIcon} My Activity</div>
          {err ? <div className={classes.ErrMsg}>Your activity could not be retrieved.</div> :
            userActivity.map(action => {
              if (action.commentID) { return <CommentAction key={action._id} {...action} />; }
              return <Action key={action._id} isBoard email={action.email} fullName={action.fullName} date={action.date}
              msg={action.boardMsg} cardID={action.cardID} listID={action.listID} boardID={action.boardID} boardTitle={action.boardTitle} />;
            })
          }
          {(!allLoaded && userActivity.length > 0) && <div className={classes.LoadMore} onClick={() => setPage(currPage => currPage + 1)}>Load more activity</div>}
          {loading && <div className={classes.Spinner}><Spinner /></div>}
      </div>
    </div>
  );
};

UserActivity.propTypes = {
  boards: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  boards: state.auth.boards
});

export default connect(mapStateToProps)(UserActivity);
