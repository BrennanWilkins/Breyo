import React, { useRef, useState, useEffect } from 'react';
import classes from './VotingResults.module.css';
import PropTypes from 'prop-types';
import { useModalToggle } from '../../../utils/customHooks';
import { BarChart } from '../../UI/Charts/Charts';
import { CloseBtnCircle } from '../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import { closeVotingResults } from '../../../store/actions';
import store from '../../../store';

const VotingResults = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [data, setData] = useState([]);
  const [listTitle, setListTitle] = useState('');

  useEffect(() => {
    const state = store.getState();
    const list = state.lists.lists.find(list => list.listID === props.listID);
    setData(list.cards.map(card => ({ title: card.title, votes: card.votes.length })));
    setListTitle(list.title);
  }, []);

  return (
    <div className={classes.Container}>
      <div className={classes.Modal} ref={modalRef}>
        <CloseBtnCircle close={props.close} />
        <div className={classes.Title}>Voting results for {listTitle}</div>
        {!data.length ?
          <p className={classes.NoData}>There are no cards in this list yet.</p> :
          <BarChart data={data} xKey="title" yKey="votes" />
        }
      </div>
    </div>
  );
};

VotingResults.propTypes = {
  listID: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(closeVotingResults())
});

export default connect(null, mapDispatchToProps)(VotingResults);
