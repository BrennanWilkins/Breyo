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

  useEffect(() => {
    const fetchData = async (boardID, page) => {
      const data = await axios.get(`/activity/all/${boardID}/${page}`);
      const updatedActivity = data.data.activity.concat(props.allComments).sort((a,b) => new Date(b.date) - new Date(a.date));
      setActivity(updatedActivity);
      setComments(updatedActivity.filter(action => action.commentID));
    };

    fetchData(props.boardID, 0);
  }, [props.boardID]);

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
