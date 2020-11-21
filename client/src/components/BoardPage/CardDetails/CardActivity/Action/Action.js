import React, { useState, useEffect } from 'react';
import classes from './Action.module.css';
import PropTypes from 'prop-types';
import { AccountBtn } from '../../../../UI/Buttons/Buttons';
import Commenter from '../Commenter/Commenter';
import parseActionMsg from '../../../../../utils/parseActionMsg';
import formatDate from '../../../../../utils/formatDate';
const Entities = require('entities');

const Action = props => {
  const [showUser, setShowUser] = useState(false);
  const [msg, setMsg] = useState(Entities.decode(props.msg));

  useEffect(() => {
    if (props.isBoard && props.cardID && props.listID && props.boardID) {
      setMsg(parseActionMsg(msg, props.cardID, props.listID, props.boardID));
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
        <div className={classes.Date}>{formatDate(props.date)}</div>
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
  boardID: PropTypes.string
};

export default Action;
