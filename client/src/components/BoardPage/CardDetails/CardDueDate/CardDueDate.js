import React, { useState } from 'react';
import classes from './CardDueDate.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleDueDateIsComplete } from '../../../../store/actions';
import { Checkbox } from '../../../UI/Inputs/Inputs';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import DueDateModal from '../DueDateModal/DueDateModal';
import { format } from 'date-fns';

const CardDueDate = props => {
  const [showModal, setShowModal] = useState(false);

  const changeHandler = () => {
    props.toggleIsComplete(props.cardID, props.listID, props.boardID);
  };

  return (
    <div className={classes.Container}>
      <div className={classes.Title}>DUE DATE</div>
      <div className={classes.Input}>
        <Checkbox checked={props.currentCard.dueDate.isComplete} clicked={changeHandler} />
        <span className={classes.Btn}>
          <ActionBtn clicked={() => setShowModal(true)}>
            {format(new Date(props.currentCard.dueDate.dueDate), `MMM d 'at' H:mm aa`)}
          </ActionBtn>
        </span>
      </div>
      {showModal && <DueDateModal close={() => setShowModal(false)} />}
    </div>
  );
};

CardDueDate.propTypes = {
  boardID: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  cardID: PropTypes.string.isRequired,
  currentCard: PropTypes.object.isRequired,
  toggleIsComplete: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleIsComplete: (cardID, listID, boardID) => dispatch(toggleDueDateIsComplete(cardID, listID, boardID))
});

export default connect(null, mapDispatchToProps)(CardDueDate);
