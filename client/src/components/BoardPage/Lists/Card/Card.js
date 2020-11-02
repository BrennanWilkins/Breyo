import React from 'react';
import PropTypes from 'prop-types';
import classes from './Card.module.css';
import { editIcon, clockIcon } from '../../../UI/icons';
import { format } from 'date-fns';

const Card = props => (
  <div className={classes.Card} onClick={props.showDetails}>
    {props.labels.length > 0 && <div className={classes.Labels}>{props.labels.map(color => <div key={color} style={{background: color}}></div>)}</div>}
    <div className={classes.EditIcon}>{editIcon}</div>
    <div className={classes.Title}>{props.title}</div>
    <div className={classes.Btns}>
      {props.dueDate &&
        <div className={props.dueDate.isComplete ? `${classes.DueDate} ${classes.DueDateComplete}` : classes.DueDate}>
          {clockIcon}{format(new Date(props.dueDate.dueDate), 'MMM d')}
        </div>}
    </div>
  </div>
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  checklists: PropTypes.array.isRequired,
  cardID: PropTypes.string.isRequired,
  dueDate: PropTypes.object,
  showDetails: PropTypes.func.isRequired
};

export default Card;
