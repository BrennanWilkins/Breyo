import React, { useState, useEffect, useRef } from 'react';
import classes from './Archive.module.css';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { recoverCard, deleteCard, recoverList, deleteList } from '../../../../store/actions';
import DeleteModal from '../DeleteModal/DeleteModal';
import { useHistory } from 'react-router';
import { useDidUpdate } from '../../../../utils/customHooks';

const Archive = props => {
  const [showCards, setShowCards] = useState(true);
  const [showDeleteID, setShowDeleteID] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [archivedCards, setArchivedCards] = useState([]);
  const [archivedLists, setArchivedLists] = useState([]);
  let history = useHistory();
  let timer = useRef();

  useEffect(() => {
    if (!searchQuery.length) { return setArchivedCards(props.archivedCards); }
    setArchivedCards(props.archivedCards.filter(card => card.title.includes(searchQuery)));
  }, [props.archivedCards]);

  useEffect(() => {
    if (!searchQuery.length) { return setArchivedLists(props.archivedLists); }
    setArchivedLists(props.archivedLists.filter(list => list.title.includes(searchQuery)));
  }, [props.archivedLists]);

  useDidUpdate(() => {
    // only filter archive after user stops typing for 400ms
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setArchivedCards(props.archivedCards.filter(card => card.title.includes(searchQuery)));
      setArchivedLists(props.archivedLists.filter(list => list.title.includes(searchQuery)));
    }, 400);
  }, [searchQuery]);

  const showDetailsHandler = (cardID, listID, card) => {
    history.push(`/board/${props.boardID}/l/${listID}/c/${cardID}`);
  };

  return (
    <>
      <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={classes.SearchInput}
      placeholder={showCards ? 'Search archived cards' : 'Search archived lists'} />
      <div className={classes.Btns}>
        <span className={showCards ? classes.Active : null}><ActionBtn clicked={() => setShowCards(true)}>Archived cards</ActionBtn></span>
        <span className={!showCards ? classes.Active : null}><ActionBtn clicked={() => setShowCards(false)}>Archived lists</ActionBtn></span>
      </div>
      {showCards ? archivedCards.map(card => (
        <div className={classes.CardContainer} key={card.cardID}>
          <div className={classes.Card} onClick={() => showDetailsHandler(card.cardID, card.listID, card)}><div>{card.title}</div></div>
          <div>
            <span className={classes.Option} onClick={() => props.recoverCard(card.cardID, card.listID, props.boardID)}>Recover Card</span>
            <span className={classes.Option} onClick={() => props.deleteCard(card.cardID, card.listID, props.boardID)}>Delete</span>
          </div>
        </div>
      )) : archivedLists.map(list => (
        <div className={classes.ListOuterContainer} key={list.listID}>
          <div className={classes.ListContainer}>
            <div className={classes.ListTitle}>{list.title}</div>
            <div>
              <span className={classes.Option} onClick={() => props.recoverList(list.listID, props.boardID)}>Recover List</span>
              <span className={classes.Option} onClick={() => setShowDeleteID(list.listID)}>Delete</span>
            </div>
          </div>
          {showDeleteID === list.listID && <DeleteModal confirmText="DELETE THIS LIST" close={() => setShowDeleteID(null)}
          delete={() => props.deleteList(list.listID, props.boardID)} userIsAdmin={props.userIsAdmin} mode="list" />}
        </div>
      ))}
    </>
  );
};

Archive.propTypes = {
  archivedCards: PropTypes.array.isRequired,
  boardID: PropTypes.string.isRequired,
  recoverCard: PropTypes.func.isRequired,
  deleteCard: PropTypes.func.isRequired,
  recoverList: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired,
  archivedLists: PropTypes.array.isRequired,
  userIsAdmin: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  archivedCards: state.lists.allArchivedCards,
  archivedLists: state.lists.archivedLists,
  boardID: state.board.boardID,
  userIsAdmin: state.board.userIsAdmin
});

const mapDispatchToProps = dispatch => ({
  recoverCard: (cardID, listID, boardID) => dispatch(recoverCard(cardID, listID, boardID)),
  deleteCard: (cardID, listID, boardID) => dispatch(deleteCard(cardID, listID, boardID)),
  recoverList: (listID, boardID) => dispatch(recoverList(listID, boardID)),
  deleteList: (listID, boardID) => dispatch(deleteList(listID, boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(Archive);
