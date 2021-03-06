import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classes from './CardDetails.module.css';
import FixedModalContainer from '../../../UI/FixedModalContainer/FixedModalContainer';
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
import CardCustomFields from '../CardCustomFields/CardCustomFields';
import CardVotes from '../CardVotes/CardVotes';

const CardDetails = props => {
  const [showVotingModal, setShowVotingModal] = useState(false);

  const archiveCardHandler = () => {
    props.archiveCard();
    props.close();
  };

  useEffect(() => { return () => props.close(); }, []);

  return (
    <FixedModalContainer close={props.close} className={classes.CardDetails}
    style={(props.currentCard.isArchived || props.currentCard.listIsArchived) ? { paddingTop: '55px'} : null}>
      {(props.currentCard.isArchived || props.currentCard.listIsArchived) &&
        <div className={classes.DisabledOverlay}>
          <div>
            <span className={classes.AlertIcon}>{alertIcon}</span>
            {props.currentCard.isArchived ? ' This card is currently archived.' : ' This card\'s list is currently archived.'}
          </div>
        </div>}
      <CardTitle title={props.currentCard.title} listTitle={props.currentListTitle} />
      <div className={classes.DetailContent}>
        <div className={classes.LeftDetails}>
          <div className={classes.TopDetailsContainer}>
            {props.currentCard.listIsVoting && <CardVotes votes={props.currentCard.votes} showVotingModal={showVotingModal}
              close={() => setShowVotingModal(false)} open={() => setShowVotingModal(true)} />}
            {props.currentCard.members.length > 0 && <CardMembers members={props.currentCard.members} />}
            {(props.currentCard.labels.length > 0 || props.currentCard.customLabels.length > 0) &&
              <CardLabels labels={props.currentCard.labels} customLabels={props.currentCard.customLabels} />}
            {!!props.currentCard.dueDate &&
              <CardDueDate currentDueDate={props.currentCard.dueDate} />}
          </div>
          <CardDesc currentDesc={props.currentCard.desc} />
          {props.currentCard.customFields.length > 0 && <CardCustomFields customFields={props.currentCard.customFields} />}
          {props.currentCard.checklists.map(checklist => (
            <CardChecklist key={checklist.checklistID} {...checklist} />
          ))}
          <CardActivity />
        </div>
        <CardOptions archiveCard={archiveCardHandler} listIsVoting={props.currentCard.listIsVoting} showVoting={() => setShowVotingModal(true)} />
      </div>
    </FixedModalContainer>
  );
};

CardDetails.propTypes = {
  close: PropTypes.func.isRequired,
  currentCard: PropTypes.object.isRequired,
  currentListTitle: PropTypes.string.isRequired,
  archiveCard: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentCard: state.lists.currentCard,
  currentListTitle: state.lists.currentListTitle
});

const mapDispatchToProps = dispatch => ({
  archiveCard: () => dispatch(archiveCard())
});

export default connect(mapStateToProps, mapDispatchToProps)(CardDetails);
