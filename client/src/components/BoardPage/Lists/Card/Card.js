import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './Card.module.css';
import { editIcon, clockIcon, checklistIcon, commentIcon } from '../../../UI/icons';
import { format } from 'date-fns';
import { Draggable } from 'react-beautiful-dnd';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import CardMemberModal from '../../CardDetails/CardMemberModal/CardMemberModal';

const Card = props => {
  const [completedChecklists, setCompletedChecklists] = useState(0);
  const [totalChecklists, setTotalChecklists] = useState(0);
  const [shownMemberEmail, setShownMemberEmail] = useState('');
  const [shownMemberFullName, setShownMemberFullName] = useState('');
  const [memberModalTop, setMemberModalTop] = useState(0);
  const [memberModalLeft, setMemberModalLeft] = useState(0);
  const cardMemberRef = useRef();

  useEffect(() => {
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
    e.stopPropagation();
    setShownMemberEmail(email);
    setShownMemberFullName(fullName);
    setMemberModalTop(rect.top + 30);
    setMemberModalLeft(rect.left);
  };

  const showDetailsHandler = e => {
    if (cardMemberRef.current && cardMemberRef.current.contains(e.target)) { return; }
    props.showDetails();
  };

  return (
    <Draggable draggableId={props.cardID} index={props.index}>
      {(provided, snapshot) => (
        <div className={classes.Card} onClick={showDetailsHandler} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {props.labels.length > 0 && <div className={classes.Labels}>{props.labels.map(color => <div key={color} style={{background: color}}></div>)}</div>}
          <div className={classes.EditIcon}>{editIcon}</div>
          <div className={classes.Title}>{props.title}</div>
          <div className={classes.Btns}>
            {props.dueDate &&
              <div className={props.dueDate.isComplete ? `${classes.Btn} ${classes.BtnComplete}` : classes.Btn}>
                {clockIcon}{format(new Date(props.dueDate.dueDate), 'MMM d')}
              </div>}
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
                  <AccountBtn clicked={e => accountBtnClickHandler(e, member.email, member.fullName)}>{member.fullName.slice(0, 1)}</AccountBtn>
                </span>
              </div>
            ))}
            {shownMemberEmail !== '' &&
            <div ref={cardMemberRef}><CardMemberModal top={memberModalTop} left={memberModalLeft} listID={props.listID}
            cardID={props.cardID} inCard email={shownMemberEmail} fullName={shownMemberFullName}
            close={() => { setShownMemberEmail(''); setShownMemberFullName(''); }} /></div>}
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
  comments: PropTypes.array.isRequired
};

export default Card;
