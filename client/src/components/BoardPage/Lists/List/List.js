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
import { withRouter } from 'react-router-dom';
import CardMemberModal from '../../../UI/CardMemberModal/CardMemberModal';

const List = props => {
  const [titleInput, setTitleInput] = useState(props.title);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [showListActions, setShowListActions] = useState(false);
  const inputRef = useRef();
  const actionsRef = useRef();
  const [actionsTop, setActionsTop] = useState(0);
  const [actionsLeft, setActionsLeft] = useState(0);
  const [shownMemberEmail, setShownMemberEmail] = useState('');
  const [shownMemberFullName, setShownMemberFullName] = useState('');
  const [memberModalTop, setMemberModalTop] = useState(0);
  const [memberModalLeft, setMemberModalLeft] = useState(0);
  const [shownModalCardID, setShownModalCardID] = useState('');

  useEffect(() => {
    // set list actions based on list button position
    const rect = actionsRef.current.getBoundingClientRect();
    setActionsTop(rect.top);
    setActionsLeft(rect.left);
  }, [showListActions]);

  useEffect(() => setTitleInput(props.title), [props.title]);

  const editTitleHandler = () => {
    if (titleInput === props.title) { return setShowTitleInput(false); }
    if (titleInput.length === 0 || titleInput.length > 200) { setShowTitleInput(false); return setTitleInput(props.title); }
    props.updateListTitle(titleInput, props.listID, props.boardID);
    setShowTitleInput(false);
  };

  const setCardDetailsHandler = cardID => {
    props.history.push(`/board/${props.boardID}/l/${props.listID}/c/${cardID}`);
  };

  const blurInputHandler = e => {
    if (inputRef.current && !inputRef.current.contains(e.target)) { inputRef.current.blur(); }
  };

  return (
    <>
    <Draggable draggableId={props.listID} index={props.indexInBoard}>
      {(provided, snapshot) => (
        <div className={classes.List} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onMouseDown={blurInputHandler}>
          <div className={classes.ListTop}>
            {!showTitleInput ? <div className={classes.ListTitle} onClick={() => setShowTitleInput(true)}>{titleInput}</div> :
            <TextArea maxRows="10" ref={inputRef} value={titleInput} onChange={e => setTitleInput(e.target.value)} className={classes.TitleInput}
            onFocus={e => e.target.select()} autoFocus onBlur={editTitleHandler} onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault(); editTitleHandler(); }}} />}
            <div ref={actionsRef} className={classes.CardOptionBtn} onClick={() => setShowListActions(true)}>{dotsIcon}</div>
          </div>
          <Droppable droppableId={props.listID}>
            {(provided, snapshot) => (
              <div className={classes.CardContainer} ref={provided.innerRef}>
                {props.cards.map((card, i) => (
                  <Card key={card.cardID} index={i} {...card} listID={props.listID} showDetails={() => setCardDetailsHandler(card.cardID)}
                  setEmail={email => { setShownMemberEmail(email); setShownModalCardID(card.cardID); }} setFullName={fullName => setShownMemberFullName(fullName)}
                  setTop={top => setMemberModalTop(top)} setLeft={left => setMemberModalLeft(left)} />
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
    {showListActions && <ListActions left={actionsLeft} top={actionsTop} close={() => setShowListActions(false)}
    title={props.title} listID={props.listID} boardID={props.boardID} />}
    {shownMemberEmail !== '' &&
    <CardMemberModal top={memberModalTop} left={memberModalLeft} listID={props.listID}
    cardID={shownModalCardID} inCard email={shownMemberEmail} fullName={shownMemberFullName}
    close={() => { setShownMemberEmail(''); setShownMemberFullName(''); }} />}
    </>
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

const mapDispatchToProps = dispatch => ({
  updateListTitle: (title, listID, boardID) => dispatch(updateListTitle(title, listID, boardID)),
  setCardDetails: (cardID, listID) => dispatch(setCardDetails(cardID, listID))
});

export default connect(null, mapDispatchToProps)(withRouter(List));
