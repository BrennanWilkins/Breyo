import React, { useRef } from 'react';
import classes from './UnassignedModal.module.css';
import PropTypes from 'prop-types';
import { useModalToggle } from '../../../../utils/customHooks';
import { CloseBtn } from '../../../UI/Buttons/Buttons';
import RoadmapCard from '../RoadmapCards/UnassignedCard';

const UnassignedModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div ref={modalRef} style={props.style} className={classes.Container}>
      <div className={classes.Title}>{props.title}</div>
      <CloseBtn className={classes.CloseBtn} close={props.close} />
      <div className={classes.Info}>Add a start and due date to schedule a card.</div>
      <div className={`StyledScrollbar ${classes.Cards}`}>
        {props.cards.map(card => (
          <RoadmapCard key={card.cardID} className={classes.Card} cardID={card.cardID}
          listID={card.listID} members={card.members} title={card.title} />
        ))}
      </div>
    </div>
  );
};

UnassignedModal.propTypes = {
  title: PropTypes.string.isRequired,
  cards: PropTypes.array.isRequired,
  close: PropTypes.func.isRequired,
  style: PropTypes.shape({
    top: PropTypes.string.isRequired,
    left: PropTypes.string.isRequired
  })
};

export default UnassignedModal;
