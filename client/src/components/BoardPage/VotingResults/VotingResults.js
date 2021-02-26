import React, { useState, useEffect } from 'react';
import classes from './VotingResults.module.css';
import PropTypes from 'prop-types';
import { BarChart } from '../../UI/Charts/Charts';
import { connect } from 'react-redux';
import { closeVotingResults } from '../../../store/actions';
import store from '../../../store';
import FixedModalContainer from '../../UI/FixedModalContainer/FixedModalContainer';

const VotingResults = props => {
  const [data, setData] = useState([]);
  const [listTitle, setListTitle] = useState('');

  useEffect(() => {
    const state = store.getState();
    const list = state.lists.lists.find(list => list.listID === props.listID);
    setData(list.cards.map(card => ({ title: card.title, votes: card.votes.length })));
    setListTitle(list.title);
  }, []);

  return (
    <FixedModalContainer close={props.close} className={classes.Modal}>
      <div className={classes.Title}>Voting results for {listTitle}</div>
      {!data.length ?
        <p className={classes.NoData}>There are no cards in this list yet.</p> :
        <BarChart data={data} xKey="title" yKey="votes" />
      }
    </FixedModalContainer>
  )
};

VotingResults.propTypes = {
  listID: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(closeVotingResults())
});

export default connect(null, mapDispatchToProps)(VotingResults);
