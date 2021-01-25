import React, { useState, useEffect } from 'react';
import classes from './ManualMoveModal.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '../../../UI/Buttons/Buttons';
import { manualMoveCardHandler } from '../../../../store/actions';
import Select from '../../../UI/Select/Select';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';

const ManualMoveModal = props => {
  const [listTitle, setListTitle] = useState(props.currentListTitle);
  const [cardPosition, setCardPosition] = useState(0);
  const [positionArr, setPositionArr] = useState([]);
  const [selectedListID, setSelectedListID] = useState(props.currentListID);
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
  }, [selectedListID]);

  const moveHandler = () => {
    props.moveCard(props.currentListID, selectedListID, sourceIndex, cardPosition);
    props.close();
  };

  return (
    <ModalContainer className={classes.Container} title="Move Card" close={props.close}>
      <div className={classes.Selects}>
        <Select title="Destination List" currentValue={listTitle} classNames={[classes.ListSelect]}>
          {props.lists.map(list => (
            <div key={list.listID} onClick={() => { setSelectedListID(list.listID); setListTitle(list.title); }}
            className={list.listID === selectedListID ? classes.ActiveOption : null}>{list.title}</div>
          ))}
        </Select>
        <Select title="Position" currentValue={String(cardPosition + 1)} classNames={[classes.PositionSelect]}>
          {positionArr.map((_, i) => (
            <div key={i} onClick={() => setCardPosition(i)}
            className={cardPosition === i ? classes.ActiveOption : classes.Option}>{i + 1}</div>
          ))}
        </Select>
      </div>
      <div className={classes.MoveBtn}><Button clicked={moveHandler}>Move</Button></div>
    </ModalContainer>
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
