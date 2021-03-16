import React, { useState, useEffect } from 'react';
import classes from './Card.module.css';
import PropTypes from 'prop-types';
import { clockIcon, checklistIcon, commentIcon, descIcon, voteIcon } from '../../../UI/icons';
import { format, isPast, isToday } from 'date-fns';
import formatDate from '../../../../utils/formatDate';
import { toggleDueDateIsComplete } from '../../../../store/actions';
import { connect } from 'react-redux';

const CardBtns = props => {
  const [completedChecklists, setCompletedChecklists] = useState(0);
  const [totalChecklists, setTotalChecklists] = useState(0);

  useEffect(() => {
    // calculate completed checklists based on whether all items are completed
    setTotalChecklists(props.checklists.length);
    setCompletedChecklists(props.checklists.filter(checklist => {
      let total = checklist.items.length;
      if (total === 0) { return false; }
      let completed = checklist.items.filter(item => item.isComplete).length;
      return completed === total;
    }).length);
  }, [props.checklists]);

  const date = props.dueDate ? new Date(props.dueDate.dueDate) : null;
  const isComplete = props.dueDate?.isComplete;

  const toggleDateCompleteHandler = e => {
    e.stopPropagation();
    props.toggleIsComplete({ cardID: props.cardID, listID: props.listID });
  };

  return (
    <div className={classes.Btns}>
      {props.dueDate &&
        <div title={'Due ' + formatDate(date)} onClick={toggleDateCompleteHandler}
        className={`${classes.Btn} ${classes.DueDateBtn} ${isComplete ? classes.BtnComplete : isPast(date) ? classes.PastDue : isToday(date) ? classes.DueSoon : ''}`}>
          {!isComplete && <span className={classes.BoxIcon} />}
          <span className={classes.ClockIcon}>{clockIcon}</span>
          {isComplete && <span className={classes.DueDateCompleteIcon}>{checklistIcon}</span>}
          {format(date, 'MMM d')}
        </div>}
      {props.hasDesc && <div className={`${classes.Btn} ${classes.DescBtn}`}>{descIcon}</div>}
      {totalChecklists > 0 &&
        <div className={completedChecklists === totalChecklists ? `${classes.Btn} ${classes.BtnComplete}` : classes.Btn}>
          {checklistIcon}{completedChecklists}/{totalChecklists}
        </div>}
      {props.commentLength > 0 && <div className={`${classes.Btn} ${classes.CommentBtn}`}>{commentIcon}{props.commentLength}</div>}
      {props.isVoting && <div className={classes.Btn} title={`${props.voteLength} vote${props.voteLength !== 1 ?'s':''}`}>{voteIcon}{props.voteLength}</div>}
    </div>
  );
};

CardBtns.propTypes = {
  dueDate: PropTypes.object,
  commentLength: PropTypes.number.isRequired,
  hasDesc: PropTypes.bool.isRequired,
  checklists: PropTypes.array.isRequired,
  isVoting: PropTypes.bool.isRequired,
  voteLength: PropTypes.number.isRequired,
  listID: PropTypes.string.isRequired,
  cardID: PropTypes.string.isRequired,
  toggleIsComplete: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleIsComplete: payload => dispatch(toggleDueDateIsComplete(payload))
});

export default connect(null, mapDispatchToProps)(CardBtns);
