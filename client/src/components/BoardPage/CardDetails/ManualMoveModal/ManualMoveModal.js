import React, { useState, useRef, useEffect } from 'react';
import classes from './ManualMoveModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '../../../UI/Buttons/Buttons';
import { manualMoveCardHandler } from '../../../../store/actions';

const ManualMoveModal = props => {
  const modalRef = useRef();
  const listRef = useRef();
  const positionRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [listTitle, setListTitle] = useState(props.currentListTitle);
  const [cardPosition, setCardPosition] = useState(0);
  const [positionArr, setPositionArr] = useState([]);
  const [selectedListID, setSelectedListID] = useState(props.currentListID);
  const [showListSelect, setShowListSelect] = useState(false);
  const [showPositionSelect, setShowPositionSelect] = useState(false);
  useModalToggle(showListSelect, listRef, () => setShowListSelect(false));
  useModalToggle(showPositionSelect, positionRef, () => setShowPositionSelect(false));
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    const selectedList = props.lists.find(list => list.listID === selectedListID);
    if (selectedList.listID === props.currentListID) {
      setSourceIndex(selectedList.cards.findIndex(card => card.cardID === props.currentCardID));
    }
    const cardLength = selectedList.cards.length;
    setCardPosition(cardLength);
    // create array of size cards.length + 1 to show all possible card positions
    setPositionArr([...Array(cardLength + 1)]);
    setShowListSelect(false);
  }, [selectedListID]);

  useEffect(() => setShowPositionSelect(false), [cardPosition]);

  const moveHandler = () => {
    props.moveCard(props.currentListID, selectedListID, sourceIndex, cardPosition);
    props.close();
  };

  return (
    <div className={classes.Container} ref={modalRef}>
      <ModalTitle title="Move Card" close={props.close} />
      <div className={classes.Selects}>
        <div className={classes.ListSelect} onClick={() => setShowListSelect(true)}>
          <div className={classes.SelectTitle}>Destination List</div>
          <div className={classes.SelectVal}>{listTitle}</div>
          {showListSelect && <div className={classes.SelectModal} ref={listRef}>
            {props.lists.map(list => (
              <div key={list.listID} onClick={() => { setSelectedListID(list.listID); setListTitle(list.title); }}
              className={list.listID === selectedListID ? classes.ActiveOption : classes.Option}>{list.title}</div>
            ))}
          </div>}
        </div>
        <div className={classes.PositionSelect} onClick={() => setShowPositionSelect(true)}>
          <div className={classes.SelectTitle}>Position</div>
          <div className={classes.SelectVal}>{cardPosition + 1}</div>
          {showPositionSelect && <div className={classes.SelectModal} ref={positionRef}>
            {positionArr.map((_, i) => (
              <div key={i} onClick={() => setCardPosition(i)}
              className={cardPosition === i ? classes.ActiveOption : classes.Option}>{i + 1}</div>
            ))}
          </div>}
        </div>
      </div>
      <div className={classes.MoveBtn}><Button clicked={moveHandler}>Move</Button></div>
    </div>
  );
};

ManualMoveModal.propTypes = {
  close: PropTypes.func.isRequired,
  lists: PropTypes.array.isRequired,
  currentListTitle: PropTypes.string.isRequired,
  currentListID: PropTypes.string.isRequired,
  moveCard: PropTypes.func.isRequired,
  currentCardID: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  lists: state.lists.lists,
  currentListID: state.lists.shownListID,
  currentListTitle: state.lists.currentListTitle,
  currentCardID: state.lists.currentCard.cardID
});

const mapDispatchToProps = dispatch => ({
  moveCard: (sourceListID, destListID, sourceIndex, destIndex) => dispatch(manualMoveCardHandler(sourceListID, destListID, sourceIndex, destIndex))
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualMoveModal);
