import React, { useState } from 'react';
import classes from './CardVotes.module.css';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';
import PropTypes from 'prop-types';
import { ActionBtn, AccountBtn } from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import { toggleCardVote } from '../../../../store/actions';
import Commenter from '../../../UI/Action/Commenter/Commenter';

const CardVotesModal = props => {
  const [shownMember, setShownMember] = useState('');
  const userHasVoted = !!props.votes.find(vote => vote.email === props.email);

  return (
    <ModalContainer className={classes.Modal} title="Voters" close={props.close}>
      <div className={`StyledScrollbar ${classes.Voters}`}>
        {props.votes.map(vote => (
          <div className={classes.Voter} key={vote.email}>
            <AccountBtn clicked={() => setShownMember(vote.email)} className={classes.AccountBtn} avatar={props.avatars[vote.email]}>
              {vote.fullName[0]}
            </AccountBtn>
            {shownMember === vote.email && <Commenter className={classes.VoterModal} {...vote} avatar={props.avatars[vote.email]} close={() => setShownMember('')} />}
          </div>
        ))}
      </div>
      <ActionBtn clicked={props.vote} className={userHasVoted ? classes.RemoveVoteBtn : classes.VoteBtn}>{userHasVoted ? 'Remove Vote' : 'Vote'}</ActionBtn>
    </ModalContainer>
  );
};

CardVotesModal.propTypes = {
  close: PropTypes.func.isRequired,
  votes: PropTypes.array.isRequired,
  email: PropTypes.string.isRequired,
  avatars: PropTypes.object.isRequired,
  vote: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  email: state.user.email,
  avatars: state.board.avatars
});

const mapDispatchToProps = dispatch => ({
  vote: () => dispatch(toggleCardVote())
});

export default connect(mapStateToProps, mapDispatchToProps)(CardVotesModal);
