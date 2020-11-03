import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './Card.module.css';
import { editIcon, clockIcon, checklistIcon } from '../../../UI/icons';
import { format } from 'date-fns';
import { Draggable } from 'react-beautiful-dnd';

const Card = props => {
  const [completedChecklists, setCompletedChecklists] = useState(0);
  const [totalChecklists, setTotalChecklists] = useState(0);

  useEffect(() => {
    setTotalChecklists(props.checklists.length);
    setCompletedChecklists(props.checklists.filter(checklist => {
      let total = checklist.items.length;
      let completed = checklist.items.filter(item => item.isComplete).length;
      return completed === total;
    }).length);
  }, [props.checklists]);

  return (
    <Draggable draggableId={props.cardID} index={props.index}>
      {(provided, snapshot) => (
        <div className={classes.Card} onClick={props.showDetails} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
          </div>
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
  index: PropTypes.number.isRequired
};

export default Card;
