import React from 'react';
import classes from './ListActions.module.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { moveAllCards } from '../../../../store/actions';

const MoveCards = props => {
  const moveHandler = listID => {
    if (listID === props.listID) { return; }
    props.moveAllCards(props.listID, listID);
    props.close();
  };

  return (
    <div className={classes.MoveContainer}>
      {props.lists.map(list => (
        <div key={list.listID}
        className={list.listID === props.listID ? classes.MoveOptionCurrent : classes.MoveOption}
        onClick={() => moveHandler(list.listID)}>
          {list.title}
        </div>
      ))}
    </div>
  );
};

MoveCards.propTypes = {
  lists: PropTypes.array.isRequired,
  listID: PropTypes.string.isRequired,
  moveAllCards: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  lists: state.lists.lists
});

const mapDispatchToProps = dispatch => ({
  moveAllCards: (oldListID, newListID) => dispatch(moveAllCards(oldListID, newListID))
});

export default connect(mapStateToProps, mapDispatchToProps)(MoveCards);
