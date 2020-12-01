import React, { useState } from 'react';
import classes from './CardDueDate.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleDueDateIsComplete } from '../../../../store/actions';
import { Checkbox } from '../../../UI/Inputs/Inputs';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import DueDateModal from '../DueDateModal/DueDateModal';
import formatDate from '../../../../utils/formatDate';

const CardDueDate = props => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={classes.Container}>
      <div className={classes.Title}>DUE DATE</div>
      <div className={classes.Input}>
        <Checkbox checked={props.currentDueDate.isComplete} clicked={props.toggleIsComplete} />
        <span className={classes.Btn}>
          <ActionBtn clicked={() => setShowModal(true)}>{formatDate(props.currentDueDate.dueDate)}</ActionBtn>
        </span>
      </div>
      {showModal && <DueDateModal close={() => setShowModal(false)} fromDueDate />}
    </div>
  );
};

CardDueDate.propTypes = {
  currentDueDate: PropTypes.object.isRequired,
  toggleIsComplete: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleIsComplete: () => dispatch(toggleDueDateIsComplete())
});

export default connect(null, mapDispatchToProps)(CardDueDate);
