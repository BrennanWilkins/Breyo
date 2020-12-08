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
import Select from '../../../UI/Select/Select';

const CopyCardModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [cardTitle, setCardTitle] = useState(props.currentCardTitle);
  const [keepChecklists, setKeepChecklists] = useState(true);
  const [keepLabels, setKeepLabels] = useState(true);
  const [listTitle, setListTitle] = useState(props.currentListTitle);
  const [cardPosition, setCardPosition] = useState(0);
  const [positionArr, setPositionArr] = useState([]);
  const [selectedListID, setSelectedListID] = useState(props.currentListID);

  useEffect(() => {
    const cards = props.lists.find(list => list.listID === selectedListID).cards;
    setCardPosition(cards.length);
    // create array of size cards.length + 1 to show all possible card positions
    setPositionArr([...Array(cards.length + 1)]);
  }, [selectedListID]);

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
        <Select title="List" currentValue={listTitle} classNames={[classes.ListSelect]}>
          {props.lists.map(list => (
            <div key={list.listID} onClick={() => { setSelectedListID(list.listID); setListTitle(list.title); }}
            className={list.listID === selectedListID ? classes.ActiveOption : null}>{list.title}</div>
          ))}
        </Select>
        <Select title="Position" currentValue={String(cardPosition + 1)} classNames={[classes.PositionSelect]}>
          {positionArr.map((_, i) => (
            <div key={i} onClick={() => setCardPosition(i)}
            className={cardPosition === i ? classes.ActiveOption : null}>{i + 1}</div>
          ))}
        </Select>
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
