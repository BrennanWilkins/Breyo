import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './CardDetails.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import { CloseBtn } from '../../../UI/Buttons/Buttons';
import CardTitle from '../CardTitle/CardTitle';
import { connect } from 'react-redux';

const CardDetails = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div className={classes.Container}>
      <div ref={modalRef} className={classes.CardDetails}>
        <span className={classes.CloseBtn}><CloseBtn close={props.close} /></span>
        <CardTitle title={props.currentCard.title} listTitle={props.currentListTitle}
        boardID={props.boardID} listID={props.listID} cardID={props.cardID} />
        {/*<CardDesc />
        <CardChecklists />
        <CardOptions />
        <CardActivity />*/}
      </div>
    </div>
  );
};

CardDetails.propTypes = {
  close: PropTypes.func.isRequired,
  cardID: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  currentCard: PropTypes.object.isRequired,
  currentListTitle: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  currentCard: state.lists.lists.find(list => list.listID === state.lists.shownListID).cards.find(card => card.cardID === state.lists.shownCardID),
  currentListTitle: state.lists.lists.find(list => list.listID === state.lists.shownListID).title,
  boardID: state.board.boardID
});

export default connect(mapStateToProps)(CardDetails);
