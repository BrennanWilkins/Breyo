import React, { useEffect, useState } from 'react';
import classes from './MemberActivity.module.css';
import PropTypes from 'prop-types';
import { activityIcon } from '../../UI/icons';
import Action from '../../UI/Action/Action';
import CommentAction from '../../UI/Action/CommentAction';
import AuthSpinner from '../../UI/AuthSpinner/AuthSpinner';
import { instance as axios } from '../../../axios';
import { connect } from 'react-redux';
import FixedModalContainer from '../../UI/FixedModalContainer/FixedModalContainer';

const MemberActivity = props => {
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const fetchData = async (email, boardID) => {
      try {
        const data = await axios.get(`/activity/member/${email}/${boardID}`);
        setLoading(false);
        setUserActivity(data.data.activity);
      } catch (err) {
        setLoading(false);
        setErr(true);
      }
    };

    fetchData(props.email, props.boardID);
  }, [props.email, props.boardID]);

  useEffect(() => {
    if (props.path !== `/board/${props.boardID}`) { props.close(); }
  }, [props.path]);

  return (
    <FixedModalContainer close={props.close} className={classes.Modal}>
      <div className={classes.Title}>
        {activityIcon}
        <span className={classes.Name}>{props.fullName}</span>
        <span className={classes.Email}>({props.email})</span>
      </div>
      <div className={classes.Activity}>
        {loading ? <div className={classes.Spinner}><AuthSpinner /></div> : !err ?
          userActivity.map(action => {
            if (action.commentID) { return <CommentAction key={action.commentID} {...action} avatar={props.avatars[action.email]} />; }
            return <Action key={action._id} isBoard {...action} msg={action.boardMsg} avatar={props.avatars[action.email]} />;
          }) :
          <div className={classes.ErrMsg}>This user's activity could not be retrieved.</div>}
      </div>
    </FixedModalContainer>
  );
};

MemberActivity.propTypes = {
  close: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  avatars: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  avatars: state.board.avatars
});

export default connect(mapStateToProps)(MemberActivity);
