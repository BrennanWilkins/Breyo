import React from 'react';
import PropTypes from 'prop-types';
import classes from './Card.module.css';
import { editIcon } from '../../../UI/icons';

const Card = props => (
  <div className={classes.Card} onClick={props.showDetails}>
    {props.labels.length > 0 && <div className={classes.Labels}>{props.labels.map(color => <div key={color} style={{background: color}}></div>)}</div>}
    <div className={classes.EditIcon}>{editIcon}</div>
    <div className={classes.Title}>{props.title}</div>
    <div className={classes.Btns}>
    </div>
  </div>
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  checklists: PropTypes.array.isRequired,
  cardID: PropTypes.string.isRequired,
  dueDate: PropTypes.string,
  showDetails: PropTypes.func.isRequired
};

export default Card;
