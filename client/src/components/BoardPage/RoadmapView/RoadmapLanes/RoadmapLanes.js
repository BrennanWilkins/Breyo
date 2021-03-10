import React from 'react';
import classes from './RoadmapLanes.module.css';
import PropTypes from 'prop-types';
import RoadmapCard from '../RoadmapCard/RoadmapCard';

const RoadmapLanes = props => (
  <div className={classes.Container} style={{ width: props.totalWidth ? props.totalWidth + 'px' : '100%' }}>
    {props.lanes.map(({ id, height, cards }) => (
      <div key={id} style={{ height }} className={classes.Lane}>
        {cards.map(({ card, width, left, top }) => (
          <RoadmapCard key={card.cardID} style={{ top: top + 'px', width: width + 'px', left: left + 'px' }} title={card.title}
          listID={card.listID} cardID={card.cardID} members={card.members} />
        ))}
      </div>
    ))}
  </div>
);

RoadmapLanes.propTypes = {
  lanes: PropTypes.array.isRequired,
  totalWidth: PropTypes.number
};

export default RoadmapLanes;
