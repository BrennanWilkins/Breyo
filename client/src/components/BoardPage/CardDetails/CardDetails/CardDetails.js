import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './CardDetails.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import { CloseBtn } from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import CardTitle from '../CardTitle/CardTitle';
import CardDesc from '../CardDesc/CardDesc';
import CardOptions from '../CardOptions/CardOptions';
import CardActivity from '../CardActivity/CardActivity';
import CardLabels from '../CardLabels/CardLabels';
import CardDueDate from '../CardDueDate/CardDueDate';
import CardChecklist from '../CardChecklist/CardChecklist';

const CardDetails = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div className={classes.Container}>
      <div ref={modalRef} className={classes.CardDetails}>
        <span className={classes.CloseBtn}><CloseBtn close={props.close} /></span>
        <CardTitle title={props.currentCard.title} listTitle={props.currentListTitle}
        boardID={props.boardID} listID={props.listID} cardID={props.cardID} />
        <div className={classes.DetailContent}>
          <div className={classes.LeftDetails}>
            {props.currentCard.labels.length > 0 && <CardLabels currentCard={props.currentCard} />}
            {!!props.currentCard.dueDate &&
              <CardDueDate currentCard={props.currentCard} listID={props.listID} cardID={props.cardID} boardID={props.boardID} />}
            <CardDesc boardID={props.boardID} listID={props.listID} cardID={props.cardID} currentCard={props.currentCard} />
            {props.currentCard.checklists.map(checklist => (
              <CardChecklist key={checklist.checklistID} {...checklist} cardID={props.cardID} listID={props.listID} boardID={props.boardID} />
            ))}
            <CardActivity />
          </div>
          <CardOptions />
        </div>
      </div>
    </div>
  );
};

CardDetails.propTypes = {
  close: PropTypes.func.isRequired,
  cardID: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  currentCard: PropTypes.object.isRequired,
  currentListTitle: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  currentCard: state.lists.lists.find(list => list.listID === state.lists.shownListID).cards.find(card => card.cardID === state.lists.shownCardID),
  currentListTitle: state.lists.lists.find(list => list.listID === state.lists.shownListID).title,
  boardID: state.board.boardID
});

export default connect(mapStateToProps)(CardDetails);
