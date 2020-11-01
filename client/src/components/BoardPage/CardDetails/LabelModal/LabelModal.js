import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './LabelModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import { LABEL_COLORS } from '../../../../utils/colors';
import { CloseBtn } from '../../../UI/Buttons/Buttons';
import { checkIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import { addCardLabel, removeCardLabel } from '../../../../store/actions';

const LabelModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  const colorHandler = color => {
    if (props.labels.includes(color)) {
      props.removeCardLabel(color, props.cardID, props.listID, props.boardID);
    } else {
      props.addCardLabel(color, props.cardID, props.listID, props.boardID);
    }
  };

  return (
    <div ref={modalRef} className={classes.Container}>
      <div className={classes.Title}>Labels<span className={classes.CloseBtn}><CloseBtn close={props.close} /></span></div>
      {LABEL_COLORS.map((color, i) => (
        <div key={i} style={{background: color}} className={classes.Color} onClick={() => colorHandler(color)}>
          <span>{props.labels.includes(color) && checkIcon}</span>
        </div>
      ))}
    </div>
  );
};

LabelModal.propTypes = {
  close: PropTypes.func.isRequired,
  labels: PropTypes.array.isRequired,
  listID: PropTypes.string.isRequired,
  cardID: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  addCardLabel: PropTypes.func.isRequired,
  removeCardLabel: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  labels: state.lists.lists.find(list => list.listID === state.lists.shownListID).cards.find(card => card.cardID === state.lists.shownCardID).labels,
  listID: state.lists.shownListID,
  cardID: state.lists.shownCardID,
  boardID: state.board.boardID
});

const mapDispatchToProps = dispatch => ({
  addCardLabel: (color, cardID, listID, boardID) => dispatch(addCardLabel(color, cardID, listID, boardID)),
  removeCardLabel: (color, cardID, listID, boardID) => dispatch(removeCardLabel(color, cardID, listID, boardID))
});

export default connect(mapStateToProps, mapDispatchToProps)(LabelModal);
