import React, { useState } from 'react';
import classes from './Action.module.css';
import PropTypes from 'prop-types';
import { AccountBtn } from '../Buttons/Buttons';
import Commenter from './Commenter/Commenter';
import formatDate from '../../../utils/formatDate';
import { Link } from 'react-router-dom';

const CommentAction = props => {
  const [showUser, setShowUser] = useState(false);

  return (
    <div className={classes.Action}>
      <span className={classes.AccountInfo}>
        <AccountBtn className={classes.AccountBtn} clicked={() => setShowUser(true)} avatar={props.avatar}>
          {props.fullName[0]}
        </AccountBtn>
        {showUser && <Commenter close={() => setShowUser(false)} email={props.email} fullName={props.fullName} avatar={props.avatar} />}
      </span>
      <div className={classes.Detail}>
        <div className={classes.MsgContainer}>
          <span className={classes.FullName}>{props.fullName}</span>
          <span> on </span>
          <Link to={`/board/${props.boardID}/l/${props.listID}/c/${props.cardID}`}>{props.cardTitle}</Link>
          <span className={classes.Date}>{formatDate(props.date)}</span>
        </div>
        <div className={classes.Comment}>{props.msg}</div>
        {props.boardTitle && <div className={classes.CommentBoardLink}><span>-</span>in board <Link to={`/board/${props.boardID}`}>{props.boardTitle}</Link></div>}
      </div>
    </div>
  );
};

CommentAction.propTypes = {
  email: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  cardID: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  cardTitle: PropTypes.string.isRequired,
  boardTitle: PropTypes.string
};

export default CommentAction;
