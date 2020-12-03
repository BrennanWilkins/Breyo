import React, { useState } from 'react';
import classes from './RoadmapContainer.module.css';
import Roadmap from '../Roadmap/Roadmap';
import RoadmapCardsMenu from '../RoadmapCardsMenu/RoadmapCardsMenu';
import RoadmapListsMenu from '../RoadmapListsMenu/RoadmapListsMenu';
import PropTypes from 'prop-types';

const RoadmapContainer = props => {
  const [showLists, setShowLists] = useState(true);
  const [showCards, setShowCards] = useState(true);

  return (
    <div className={classes.Container} style={props.showMenu ? {width: 'calc(100% - 350px)'} : null}>
      <Roadmap cardsShown={showCards} listsShown={showLists} />
      <RoadmapListsMenu show={showLists} toggle={() => setShowLists(prev => !prev)} />
      <RoadmapCardsMenu show={showCards} toggle={() => setShowCards(prev => !prev)} />
    </div>
  );
};

RoadmapContainer.propTypes = {
  showMenu: PropTypes.bool.isRequired
};

export default RoadmapContainer;
