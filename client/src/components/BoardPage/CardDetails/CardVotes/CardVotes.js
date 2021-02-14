import React from 'react';
import classes from './CardVotes.module.css';
import PropTypes from 'prop-types';
import CardVotesModal from './CardVotesModal';

const CardVotes = props => (
  <div className={classes.Container}>
    <div className={classes.Title}>VOTES</div>
    <div className={classes.Votes} onClick={props.open}>
      {props.votes.length} {props.votes.length === 1 ? 'vote' : 'votes'}
    </div>
    {props.showVotingModal && <CardVotesModal votes={props.votes} close={props.close} />}
  </div>
);

CardVotes.propTypes = {
  votes: PropTypes.array.isRequired,
  showVotingModal: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  open: PropTypes.func.isRequired
};

export default CardVotes;
