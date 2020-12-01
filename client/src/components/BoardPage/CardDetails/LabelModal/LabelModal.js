import React, { useRef, useLayoutEffect } from 'react';
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
      props.removeCardLabel(color);
    } else {
      props.addCardLabel(color);
    }
  };

  useLayoutEffect(() => {
    if (!props.openFromMiddle) { return; }
    if (modalRef.current.getBoundingClientRect().right + 5 >= window.innerWidth) {
      modalRef.current.style.right = '0';
    } else {
      modalRef.current.style.left = '-1px';
    }
  }, [props.openFromMiddle]);

  return (
    <div ref={modalRef} className={props.openFromMiddle ? classes.MiddleContainer : classes.Container}>
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
  addCardLabel: PropTypes.func.isRequired,
  removeCardLabel: PropTypes.func.isRequired,
  openFromMiddle: PropTypes.bool
};

const mapStateToProps = state => ({
  labels: state.lists.currentCard.labels
});

const mapDispatchToProps = dispatch => ({
  addCardLabel: color => dispatch(addCardLabel(color)),
  removeCardLabel: color => dispatch(removeCardLabel(color))
});

export default connect(mapStateToProps, mapDispatchToProps)(LabelModal);
