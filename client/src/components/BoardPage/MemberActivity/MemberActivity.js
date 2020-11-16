import React, { useRef, useEffect, useState } from 'react';
import classes from './MemberActivity.module.css';
import { useModalToggle } from '../../../utils/customHooks';
import { CloseBtnCircle } from '../../UI/Buttons/Buttons';
import PropTypes from 'prop-types';
import { activityIcon } from '../../UI/icons';
import Action from '../CardDetails/CardActivity/Action/Action';
import CommentAction from '../CardDetails/CardActivity/Action/CommentAction';
import AuthSpinner from '../../UI/AuthSpinner/AuthSpinner';
import { instance as axios } from '../../../axios';
import { connect } from 'react-redux';

const MemberActivity = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const fetchData = async (email, boardID) => {
      try {
        const data = await axios.get(`/activity/member/${email}/${boardID}`);
        setLoading(false);
        setUserActivity(data.data.activity.concat(props.allComments.filter(comment => comment.email === props.email)).sort((a,b) => new Date(b.date) - new Date(a.date)));
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
    <div className={classes.Container}>
      <div ref={modalRef} className={classes.Modal}>
        <CloseBtnCircle close={props.close} />
        <div className={classes.Title}>
          {activityIcon}
          <span className={classes.Name}>{props.fullName}</span>
          <span className={classes.Email}>({props.email})</span>
        </div>
        <div className={classes.Activity}>
          {loading ? <div className={classes.Spinner}><AuthSpinner /></div> : !err ?
            userActivity.map(action => {
              if (action.commentID) { return <CommentAction key={action.commentID} {...action} boardID={props.boardID} />; }
              return <Action key={action._id} isBoard email={action.email} fullName={action.fullName} date={action.date}
              msg={action.boardMsg} cardID={action.cardID} listID={action.listID} boardID={action.boardID} />;
            }) :
            <div className={classes.ErrMsg}>This user's activity could not be retrieved.</div>}
        </div>
      </div>
    </div>
  );
};

MemberActivity.propTypes = {
  close: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  allComments: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  allComments: state.lists.allComments
});

export default connect(mapStateToProps)(MemberActivity);
