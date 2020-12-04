import React, { useState, useEffect } from 'react';
import classes from './RoadmapContainer.module.css';
import Roadmap from '../Roadmap/Roadmap';
import RoadmapCardsMenu from '../RoadmapCardsMenu/RoadmapCardsMenu';
import RoadmapListsMenu from '../RoadmapListsMenu/RoadmapListsMenu';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeRoadmap } from '../../../../store/actions';
import { useHistory } from 'react-router-dom';

const RoadmapContainer = props => {
  let history = useHistory();
  const [showLists, setShowLists] = useState(true);
  const [showCards, setShowCards] = useState(false);
  const [assignedCards, setAssignedCards] = useState([]);
  const [unassignedCards, setUnassignedCards] = useState([]);

  useEffect(() => {
    if (!props.shownRoadmapListID) { return; }
    const cards = props.lists.find(list => list.listID === props.shownRoadmapListID).cards;
    setAssignedCards(cards.filter(card => card.dueDate));
    setUnassignedCards(cards.filter(card => !card.dueDate));
  }, [props.lists, props.shownRoadmapListID]);

  useEffect(() => {
    return () => props.closeRoadmap();
  }, []);

  const showCardDetailsHandler = cardID => {
    history.push(`/board/${props.boardID}/l/${props.shownRoadmapListID}/c/${cardID}`);
  };

  return (
    <div className={classes.Container} style={props.showMenu ? {width: 'calc(100% - 350px)'} : null}>
      <Roadmap cardsShown={showCards} listsShown={showLists} cards={assignedCards} showDetails={showCardDetailsHandler} />
      <RoadmapListsMenu show={showLists} toggle={() => setShowLists(prev => !prev)} lists={props.lists} shownRoadmapListID={props.shownRoadmapListID} />
      <RoadmapCardsMenu show={showCards} toggle={() => setShowCards(prev => !prev)} cards={unassignedCards} showDetails={showCardDetailsHandler} />
    </div>
  );
};

RoadmapContainer.propTypes = {
  showMenu: PropTypes.bool.isRequired,
  lists: PropTypes.array.isRequired,
  shownRoadmapListID: PropTypes.string,
  boardID: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  lists: state.lists.lists,
  shownRoadmapListID: state.board.shownRoadmapListID,
  boardID: state.board.boardID
});

const mapDispatchToProps = dispatch => ({
  closeRoadmap: () => dispatch(closeRoadmap())
});

export default connect(mapStateToProps, mapDispatchToProps)(RoadmapContainer);
