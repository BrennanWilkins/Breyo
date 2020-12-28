import React from 'react';
import PropTypes from 'prop-types';
import classes from './Card.module.css';
import { editIcon } from '../../../UI/icons';
import { Draggable } from 'react-beautiful-dnd';
import { LABEL_COLORS } from '../../../../utils/backgrounds';
import CardMembers from './CardMembers';
import CardBtns from './CardBtns';

const Card = props => {
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
          {props.labels.length > 0 && <div className={classes.Labels}>
            {LABEL_COLORS.filter(color => props.labels.includes(color)).map(color => <div key={color} style={{background: color}}></div>)}
          </div>}
          <div className={classes.EditIcon}>{editIcon}</div>
          <div className={classes.Title}>{props.title}</div>
          <CardBtns dueDate={props.dueDate} hasDesc={props.desc !== ''} checklists={props.checklists} commentLength={props.comments.length} />
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
  setEmail: PropTypes.func.isRequired,
  setFullName: PropTypes.func.isRequired,
  setTop: PropTypes.func.isRequired,
  setLeft: PropTypes.func.isRequired,
  desc: PropTypes.string.isRequired
};

export default Card;
