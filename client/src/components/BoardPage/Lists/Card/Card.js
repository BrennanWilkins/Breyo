import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './Card.module.css';
import { editIcon, clockIcon, checklistIcon, commentIcon, descIcon } from '../../../UI/icons';
import { format } from 'date-fns';
import { Draggable } from 'react-beautiful-dnd';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import formatDate from '../../../../utils/formatDate';

const Card = props => {
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

  const accountBtnClickHandler = (e, email, fullName) => {
    const rect = e.target.getBoundingClientRect();
    // stop event propagation to card so card details not opened
    e.stopPropagation();
    props.setEmail(email);
    props.setFullName(fullName);
    // set modal pos based on AccountBtn position
    props.setTop(rect.top + 30);
    props.setLeft(rect.left);
  };

  return (
    <Draggable draggableId={props.cardID} index={props.index}>
      {(provided, snapshot) => (
        <div className={classes.Card} onClick={props.showDetails} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {props.labels.length > 0 && <div className={classes.Labels}>{props.labels.map(color => <div key={color} style={{background: color}}></div>)}</div>}
          <div className={classes.EditIcon}>{editIcon}</div>
          <div className={classes.Title}>{props.title}</div>
          <div className={classes.Btns}>
            {props.dueDate &&
              <div title={'Due ' + formatDate(new Date(props.dueDate.dueDate))} className={props.dueDate.isComplete ? `${classes.Btn} ${classes.BtnComplete}` : classes.Btn}>
                {clockIcon}{format(new Date(props.dueDate.dueDate), 'MMM d')}
              </div>}
            {props.desc !== '' && <div className={classes.Btn}>{descIcon}</div>}
            {totalChecklists > 0 &&
              <div className={completedChecklists === totalChecklists ? `${classes.Btn} ${classes.BtnComplete}` : classes.Btn}>
                {checklistIcon}{completedChecklists}/{totalChecklists}
              </div>}
            {props.comments.length > 0 && <div className={classes.CommentBtn}>{commentIcon}{props.comments.length}</div>}
          </div>
          {props.members.length > 0 &&
          <div className={classes.Members}>
            {props.members.map(member => (
              <div key={member.email} className={classes.Member}>
                <span className={classes.AccountBtn}>
                  <AccountBtn title={member.fullName} clicked={e => accountBtnClickHandler(e, member.email, member.fullName)}>{member.fullName.slice(0, 1)}</AccountBtn>
                </span>
              </div>
            ))}
          </div>}
        </div>
      )}
    </Draggable>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  checklists: PropTypes.array.isRequired,
  cardID: PropTypes.string.isRequired,
  dueDate: PropTypes.object,
  showDetails: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  members: PropTypes.array.isRequired,
  listID: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  setEmail: PropTypes.func.isRequired,
  setFullName: PropTypes.func.isRequired,
  setTop: PropTypes.func.isRequired,
  setLeft: PropTypes.func.isRequired,
  desc: PropTypes.string.isRequired
};

export default Card;
