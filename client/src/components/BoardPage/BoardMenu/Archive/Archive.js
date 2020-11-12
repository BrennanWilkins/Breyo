import React, { useState } from 'react';
import classes from './Archive.module.css';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setCardDetailsArchived, recoverCard, deleteCard, recoverList, deleteList } from '../../../../store/actions';

const Archive = props => {
  const [showCards, setShowCards] = useState(true);

  return (
    <>
      <div className={classes.Btns}>
        <span className={showCards ? classes.Active : null}><ActionBtn clicked={() => setShowCards(true)}>Archived cards</ActionBtn></span>
        <span className={!showCards ? classes.Active : null}><ActionBtn clicked={() => setShowCards(false)}>Archived lists</ActionBtn></span>
      </div>
      {showCards ? props.archivedCards.map(card => (
        <div className={classes.CardContainer} key={card.cardID}>
          <div className={classes.Card} onClick={() => props.setCardDetailsArchived(card.cardID, card.listID, card)}><div>{card.title}</div></div>
          <div className={classes.Options}>
            <span onClick={() => props.recoverCard(card.cardID, card.listID, props.boardID)}>Recover Card</span>
            <span onClick={() => props.deleteCard(card.cardID, card.listID, props.boardID)}>Delete</span>
          </div>
        </div>
      )) : props.archivedLists.map(list => (
        <div className={classes.ListContainer} key={list.listID}>
          <div className={classes.ListTitle}>{list.title}</div>
          <div className={classes.Options}>
            <span onClick={() => props.recoverList(list.listID, props.boardID)}>Recover List</span>
            <span onClick={() => props.deleteList(list.listID, props.boardID)}>Delete</span>
          </div>
        </div>
      ))}
    </>
  );
};

Archive.propTypes = {
  archivedCards: PropTypes.array.isRequired,
  setCardDetailsArchived: PropTypes.func.isRequired,
  boardID: PropTypes.string.isRequired,
  recoverCard: PropTypes.func.isRequired,
  deleteCard: PropTypes.func.isRequired,
  recoverList: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired,
  archivedLists: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  archivedCards: state.lists.archivedCards,
  archivedLists: state.lists.archivedLists,
  boardID: state.board.boardID
});

const mapDispatchToProps = dispatch => ({
  setCardDetailsArchived: (cardID, listID, card) => dispatch(setCardDetailsArchived(cardID, listID, card)),
  recoverCard: (cardID, listID, boardID) => dispatch(recoverCard(cardID, listID, boardID)),
  deleteCard: (cardID, listID, boardID) => dispatch(deleteCard(cardID, listID, boardID)),
  recoverList: (listID, boardID) => dispatch(recoverList(listID, boardID)),
  deleteList: (listID, boardID) => dispatch(deleteList(listID, boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(Archive);