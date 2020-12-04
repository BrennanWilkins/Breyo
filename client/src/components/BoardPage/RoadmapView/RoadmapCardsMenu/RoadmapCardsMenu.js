import React from 'react';
import classes from './RoadmapCardsMenu.module.css';
import PropTypes from 'prop-types';
import MenuToggle from '../../../UI/MenuToggle/MenuToggle';

const RoadmapCardsMenu = props => {
  return (
    <div className={props.show ? classes.Container : classes.Hide}>
      <MenuToggle onLeft collapsed={!props.show} toggle={props.toggle} />
      <div className={classes.Title}>Unassigned Cards</div>
      <div className={classes.Cards}>
        {props.cards.map(card => (
          <div className={classes.Card} key={card.cardID} onClick={() => props.showDetails(card.cardID)}>{card.title}</div>
        ))}
      </div>
    </div>
  );
};

RoadmapCardsMenu.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  cards: PropTypes.array.isRequired,
  showDetails: PropTypes.func.isRequired
};

export default RoadmapCardsMenu;
