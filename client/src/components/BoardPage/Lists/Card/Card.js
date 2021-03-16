import React from 'react';
import PropTypes from 'prop-types';
import classes from './Card.module.css';
import { editIcon } from '../../../UI/icons';
import { Draggable } from 'react-beautiful-dnd';
import CardMembers from './CardMembers';
import CardBtns from './CardBtns';
import CardLabels from './CardLabels';

const Card = props => {
  const accountBtnClickHandler = (e, email, fullName) => {
    // set modal position based on AccountBtn position
    const rect = e.target.getBoundingClientRect();
    // stop event propagation to card so card details not opened
    e.stopPropagation();
    props.setShownMember({
      email,
      fullName,
      top: rect.top + 30,
      left: rect.left,
      cardID: props.cardID
    });
  };

  return (
    <Draggable draggableId={props.cardID} index={props.index}>
      {(provided, snapshot) => (
        <div className={classes.Card} onClick={() => props.showDetails(props.cardID)} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {(props.labels.length > 0 || props.customLabels.length > 0) && <CardLabels labels={props.labels} customLabels={props.customLabels} />}
          <div className={classes.EditIcon}>{editIcon}</div>
          <div className={classes.Title}>{props.title}</div>
          <CardBtns dueDate={props.dueDate} hasDesc={props.desc !== ''} checklists={props.checklists} commentLength={props.comments.length}
          voteLength={props.votes.length} isVoting={props.isVoting} listID={props.listID} cardID={props.cardID} />
          {props.members.length > 0 && <CardMembers members={props.members} clickHandler={accountBtnClickHandler} />}
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
  setShownMember: PropTypes.func.isRequired,
  desc: PropTypes.string.isRequired,
  isVoting: PropTypes.bool.isRequired,
  votes: PropTypes.array.isRequired,
  customLabels: PropTypes.array.isRequired
};

export default React.memo(Card);
