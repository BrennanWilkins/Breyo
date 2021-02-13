import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './List.module.css';
import { plusIcon } from '../../../UI/icons';
import AddCard from '../AddCard/AddCard';
import Card from '../Card/Card';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import ListActions from '../ListActions/ListActions';
import CardMemberModal from '../../../UI/CardMemberModal/CardMemberModal';
import { useHistory } from 'react-router';
import ListTitle from './ListTitle';

const List = props => {
  const history = useHistory();
  const [showAddCard, setShowAddCard] = useState(false);
  const [showListActions, setShowListActions] = useState(false);
  const inputRef = useRef();
  const actionsRef = useRef();
  const [actionsPos, setActionsPos] = useState({ top: 0, left: 0 });
  const [shownMember, setShownMember] = useState(null);

  useEffect(() => {
    // set list actions based on list button position
    const rect = actionsRef.current.getBoundingClientRect();
    setActionsPos({ top: rect.top, left: rect.left });
  }, [showListActions]);

  const setCardDetailsHandler = useCallback(cardID => (
    history.push(`/board/${props.boardID}/l/${props.listID}/c/${cardID}`)
  ), [props.boardID, props.listID]);

  const shownMemberHandler = useCallback(member => setShownMember(member), [setShownMember]);

  const blurInputHandler = e => {
    if (inputRef.current && !inputRef.current.contains(e.target)) { inputRef.current.blur(); }
  };

  return (
    <>
    <Draggable draggableId={props.listID} index={props.indexInBoard}>
      {(provided, snapshot) => (
        <div className={classes.List} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onMouseDown={blurInputHandler}>
          <ListTitle title={props.title} refs={{ actionsRef, inputRef }} showActions={() => setShowListActions(true)} listID={props.listID} />
          <Droppable droppableId={props.listID}>
            {(provided, snapshot) => (
              <div className={classes.CardContainer} ref={provided.innerRef}>
                {props.cards.map((card, i) => (
                  <Card key={card.cardID} index={i} {...card} listID={props.listID} showDetails={setCardDetailsHandler} setShownMember={shownMemberHandler} />
                ))}
                {showAddCard && <AddCard close={() => setShowAddCard(false)} boardID={props.boardID} listID={props.listID} />}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {!showAddCard && <div className={classes.AddCardBtn} onClick={() => setShowAddCard(true)}>
            {plusIcon}{props.cards.length === 0 ? 'Add a card' : 'Add another card'}
          </div>}
        </div>
      )}
    </Draggable>
    {showListActions && <ListActions {...actionsPos} close={() => setShowListActions(false)}
    title={props.title} listID={props.listID} boardID={props.boardID} isVoting={props.isVoting} />}
    {shownMember && <CardMemberModal {...shownMember} listID={props.listID} inCard close={() => setShownMember(null)} />}
    </>
  );
};

List.propTypes = {
  title: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  cards: PropTypes.array.isRequired,
  indexInBoard: PropTypes.number.isRequired,
  boardID: PropTypes.string.isRequired,
  isVoting: PropTypes.bool.isRequired
};

export default React.memo(List);
