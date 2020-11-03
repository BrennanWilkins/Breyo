import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './List.module.css';
import { plusIcon, dotsIcon } from '../../../UI/icons';
import TextArea from 'react-textarea-autosize';
import { connect } from 'react-redux';
import { updateListTitle, setCardDetails } from '../../../../store/actions';
import AddCard from '../AddCard/AddCard';
import Card from '../Card/Card';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const List = props => {
  const [titleInput, setTitleInput] = useState(props.title);
  const [showAddCard, setShowAddCard] = useState(false);

  const titleBlurHandler = () => {
    if (titleInput === props.title) { return; }
    if (titleInput.length === 0 || titleInput.length >= 200) { return setTitleInput(props.title); }
    props.updateListTitle(titleInput, props.listID, props.boardID);
  };

  return (
    <Draggable draggableId={props.listID} index={props.indexInBoard} disableInteractiveElementBlocking>
      {(provided, snapshot) => (
        <div className={classes.List} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div className={classes.ListTop}>
            <TextArea maxRows="20" value={titleInput} onChange={e => setTitleInput(e.target.value)} className={classes.TitleInput}
            onFocus={e => e.target.select()} onBlur={titleBlurHandler} onMouseDown={e => e.preventDefault()} onMouseUp={e => e.target.focus()} />
            <div className={classes.CardOptionBtn}>{dotsIcon}</div>
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
