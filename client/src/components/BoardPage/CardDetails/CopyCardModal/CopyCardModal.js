import React, { useState, useRef, useEffect } from 'react';
import classes from './CopyCardModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import Button from '../../../UI/Buttons/Buttons';
import TextArea from 'react-textarea-autosize';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Checkbox } from '../../../UI/Inputs/Inputs';
import { copyCard } from '../../../../store/actions';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';

const CopyCardModal = props => {
  const modalRef = useRef();
  const listRef = useRef();
  const positionRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [cardTitle, setCardTitle] = useState(props.currentCardTitle);
  const [keepChecklists, setKeepChecklists] = useState(true);
  const [keepLabels, setKeepLabels] = useState(true);
  const [listTitle, setListTitle] = useState(props.currentListTitle);
  const [cardPosition, setCardPosition] = useState(0);
  const [positionArr, setPositionArr] = useState([]);
  const [selectedListID, setSelectedListID] = useState(props.currentListID);
  const [showListSelect, setShowListSelect] = useState(false);
  const [showPositionSelect, setShowPositionSelect] = useState(false);
  useModalToggle(showListSelect, listRef, () => setShowListSelect(false));
  useModalToggle(showPositionSelect, positionRef, () => setShowPositionSelect(false));

  useEffect(() => {
    const cards = props.lists.find(list => list.listID === selectedListID).cards;
    setCardPosition(cards.length);
    // create array of size cards.length + 1 to show all possible card positions
    setPositionArr([...Array(cards.length + 1)]);
    setShowListSelect(false);
  }, [selectedListID]);

  useEffect(() => setShowPositionSelect(false), [cardPosition]);

  const copyHandler = () => {
    if (cardTitle.length > 200) { return; }
    props.copyCard(cardTitle, keepChecklists, keepLabels, selectedListID, cardPosition);
    props.close();
  };

  return (
    <div ref={modalRef} className={classes.Container}>
      <ModalTitle title="Copy Card" close={props.close} />
      <TextArea className={classes.Input} value={cardTitle} onChange={e => setCardTitle(e.target.value)}
      minRows="3" maxRows="3" placeholder="Enter a title for this card" onKeyPress={e => e.key === 'Enter' ? e.target.blur() : null} />
      <div className={classes.Keeps}>
        <div className={classes.Checkbox}><Checkbox checked={keepChecklists} clicked={() => setKeepChecklists(prev => !prev)} />Keep checklists</div>
        <Checkbox checked={keepLabels} clicked={() => setKeepLabels(prev => !prev)} />Keep labels
      </div>
      <div className={classes.CopyTitle}>COPY TO</div>
      <div className={classes.Selects}>
        <div className={classes.ListSelect} onClick={() => setShowListSelect(true)}>
          <div className={classes.SelectTitle}>List</div>
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
      <div className={classes.CopyBtn}><Button clicked={copyHandler}>Copy Card</Button></div>
    </div>
  );
};

CopyCardModal.propTypes = {
  close: PropTypes.func.isRequired,
  lists: PropTypes.array.isRequired,
  currentListID: PropTypes.string.isRequired,
  currentListTitle: PropTypes.string.isRequired,
  copyCard: PropTypes.func.isRequired,
  currentCardTitle: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  lists: state.lists.lists,
  currentListID: state.lists.shownListID,
  currentListTitle: state.lists.currentListTitle,
  currentCardTitle: state.lists.currentCard.title
});

const mapDispatchToProps = dispatch => ({
  copyCard: (title, keepChecklists, keepLabels, destListID, destIndex) => dispatch(copyCard(title, keepChecklists, keepLabels, destListID, destIndex))
});

export default connect(mapStateToProps, mapDispatchToProps)(CopyCardModal);
