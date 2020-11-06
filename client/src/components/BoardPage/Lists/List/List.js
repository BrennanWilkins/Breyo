import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './List.module.css';
import { plusIcon, dotsIcon } from '../../../UI/icons';
import TextArea from 'react-textarea-autosize';
import { connect } from 'react-redux';
import { updateListTitle, setCardDetails } from '../../../../store/actions';
import AddCard from '../AddCard/AddCard';
import Card from '../Card/Card';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import ListActions from '../ListActions/ListActions';

const List = props => {
  const [titleInput, setTitleInput] = useState(props.title);
  const [showAddCard, setShowAddCard] = useState(false);
  const inputRef = useRef();
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [showListActions, setShowListActions] = useState(false);

  const titleBlurHandler = () => {
    if (titleInput === props.title) { return setShowTitleInput(false); }
    if (titleInput.length === 0 || titleInput.length >= 200) { setShowTitleInput(false); return setTitleInput(props.title); }
    props.updateListTitle(titleInput, props.listID, props.boardID);
    setShowTitleInput(false);
  };

  useEffect(() => {
    if (showTitleInput) { inputRef.current.focus(); }
  }, [showTitleInput]);

  return (
    <Draggable draggableId={props.listID} index={props.indexInBoard}>
      {(provided, snapshot) => (
        <div className={classes.List} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div className={classes.ListTop}>
            {!showTitleInput ? <div className={classes.ListTitle} onClick={() => setShowTitleInput(true)}>{titleInput}</div> :
            <TextArea ref={inputRef} maxRows="20" value={titleInput} onChange={e => setTitleInput(e.target.value)} className={classes.TitleInput}
            onFocus={e => e.target.select()} onBlur={titleBlurHandler} />}
            <div className={classes.ListActionsContainer}>
              <div className={classes.CardOptionBtn} onClick={() => setShowListActions(true)}>{dotsIcon}</div>
              {showListActions && <ListActions close={() => setShowListActions(false)} title={props.title} listID={props.listID} boardID={props.boardID} />}
            </div>
          </div>
          <Droppable droppableId={props.listID}>
            {(provided, snapshot) => (
              <div className={classes.CardContainer} ref={provided.innerRef}>
                {props.cards.map((card, i) => <Card key={card.cardID} index={i} {...card} showDetails={() => props.setCardDetails(card.cardID, props.listID)} />)}
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
  );
};

List.propTypes = {
  title: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  cards: PropTypes.array.isRequired,
  indexInBoard: PropTypes.number.isRequired,
  boardID: PropTypes.string.isRequired,
  updateListTitle: PropTypes.func.isRequired,
  setCardDetails: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  lists: state.lists.lists
});

const mapDispatchToProps = dispatch => ({
  updateListTitle: (title, listID, boardID) => dispatch(updateListTitle(title, listID, boardID)),
  setCardDetails: (cardID, listID) => dispatch(setCardDetails(cardID, listID))
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
