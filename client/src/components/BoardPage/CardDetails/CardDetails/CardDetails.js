import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './CardDetails.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import { CloseBtnCircle } from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import CardTitle from '../CardTitle/CardTitle';
import CardDesc from '../CardDesc/CardDesc';
import CardOptions from '../CardOptions/CardOptions';
import CardActivity from '../CardActivity/CardActivity';
import CardLabels from '../CardLabels/CardLabels';
import CardDueDate from '../CardDueDate/CardDueDate';
import CardChecklist from '../CardChecklist/CardChecklist';
import { archiveCard } from '../../../../store/actions';
import { alertIcon } from '../../../UI/icons';
import CardMembers from '../CardMembers/CardMembers';

const CardDetails = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  const archiveCardHandler = () => {
    props.archiveCard(props.cardID, props.listID, props.boardID);
    props.close();
  };

  useEffect(() => {
    return () => props.close();
  }, []);

  return (
    <div className={classes.Container}>
      <div ref={modalRef} className={classes.CardDetails} style={(props.currentCard.isArchived || props.currentCard.listIsArchived) ? { paddingTop: '55px'} : null}>
        <CloseBtnCircle close={props.close} />
        {(props.currentCard.isArchived || props.currentCard.listIsArchived) &&
          <div className={classes.DisabledOverlay}>
            <div>
              <span className={classes.AlertIcon}>{alertIcon}</span>
              {props.currentCard.isArchived ? ' This card is currently archived.' : ' This card\'s list is currently archived.'}
              <CloseBtnCircle close={props.close} />
            </div>
          </div>}
        <CardTitle title={props.currentCard.title} listTitle={props.currentListTitle}
        boardID={props.boardID} listID={props.listID} cardID={props.cardID} />
        <div className={classes.DetailContent}>
          <div className={classes.LeftDetails}>
            <div className={classes.TopDetailsContainer}>
              {props.currentCard.members.length > 0 && <CardMembers members={props.currentCard.members} cardID={props.cardID} listID={props.listID} />}
              {props.currentCard.labels.length > 0 && <CardLabels currentCard={props.currentCard} />}
              {!!props.currentCard.dueDate &&
                <CardDueDate currentCard={props.currentCard} listID={props.listID} cardID={props.cardID} boardID={props.boardID} />}
            </div>
            <CardDesc currentDesc={props.currentCard.desc} />
            {props.currentCard.checklists.map(checklist => (
              <CardChecklist key={checklist.checklistID} {...checklist} cardID={props.cardID} listID={props.listID} boardID={props.boardID} />
            ))}
            <CardActivity />
          </div>
          <CardOptions archiveCard={archiveCardHandler} />
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
  boardID: state.board.boardID,
  currentCard: state.lists.currentCard,
  currentListTitle: state.lists.currentListTitle
});

const mapDispatchToProps = dispatch => ({
  archiveCard: (cardID, listID, boardID) => dispatch(archiveCard(cardID, listID, boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(CardDetails);
