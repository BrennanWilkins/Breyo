import React, { useState, useEffect } from 'react';
import classes from './Action.module.css';
import PropTypes from 'prop-types';
import { AccountBtn } from '../Buttons/Buttons';
import Commenter from './Commenter/Commenter';
import parseActionMsg from '../../../utils/parseActionMsg';
import formatDate, { formatDateLong } from '../../../utils/formatDate';
import { Link } from 'react-router-dom';

const Action = props => {
  const [showUser, setShowUser] = useState(false);
  const [msg, setMsg] = useState(props.msg);

  useEffect(() => {
    if (props.isBoard && props.cardID && props.listID && props.boardID) {
      setMsg(parseActionMsg(props.msg, props.cardID, props.listID, props.boardID));
    }
  }, [props.isBoard, props.cardID, props.listID, props.boardID]);

  return (
    <div className={classes.Action}>
      <span className={classes.AccountInfo}>
        <span className={classes.AccountBtn}><AccountBtn clicked={() => setShowUser(true)}>{props.fullName.slice(0, 1)}</AccountBtn></span>
        {showUser && <Commenter close={() => setShowUser(false)} email={props.email} fullName={props.fullName} />}
      </span>
      <div className={classes.Detail}>
        <div className={classes.MsgContainer}>
          <span className={classes.FullName}>{props.fullName} </span>
          <span className={classes.Msg}>{msg}</span>
        </div>
        <div className={classes.Date}>
          <span title={formatDateLong(props.date)}>{formatDate(props.date)}</span>
          {props.boardTitle && <div className={classes.BoardLink}><span>-</span>in board <Link to={`/board/${props.boardID}`}>{props.boardTitle}</Link></div>}
        </div>
      </div>
    </div>
  );
};

Action.propTypes = {
  email: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isBoard: PropTypes.bool,
  cardID: PropTypes.string,
  listID: PropTypes.string,
  boardID: PropTypes.string,
  boardTitle: PropTypes.string
};

export default Action;
