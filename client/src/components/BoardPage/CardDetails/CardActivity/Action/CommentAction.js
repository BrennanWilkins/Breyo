import React, { useState, useEffect } from 'react';
import classes from './Action.module.css';
import PropTypes from 'prop-types';
import { AccountBtn } from '../../../../UI/Buttons/Buttons';
import Commenter from '../Commenter/Commenter';
import formatDate from '../../../../../utils/formatDate';
import { Link } from 'react-router-dom';

const CommentAction = props => {
  const [showUser, setShowUser] = useState(false);

  return (
    <div className={classes.Action}>
      <span className={classes.AccountInfo}>
        <span className={classes.AccountBtn}><AccountBtn clicked={() => setShowUser(true)}>{props.fullName.slice(0, 1)}</AccountBtn></span>
        {showUser && <Commenter close={() => setShowUser(false)} email={props.email} fullName={props.fullName} />}
      </span>
      <div className={classes.Detail}>
        <div className={classes.MsgContainer}>
          <span className={classes.FullName}>{props.fullName}</span>
          <span> on </span>
          <Link to={`/board/${props.boardID}/l/${props.listID}/c/${props.cardID}`}>{props.cardTitle}</Link>
          <span className={classes.Date}>{formatDate(props.date)}</span>
        </div>
        <div className={classes.Comment}>{props.msg}</div>
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
  cardTitle: PropTypes.string.isRequired
};

export default CommentAction;
