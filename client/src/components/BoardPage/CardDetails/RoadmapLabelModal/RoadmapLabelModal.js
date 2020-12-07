import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classes from './RoadmapLabelModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import { LABEL_COLORS } from '../../../../utils/colors';
import { checkIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import { changeRoadmapLabel } from '../../../../store/actions';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';

const RoadmapLabelModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  const colorHandler = color => {
    if (props.currentLabel === color) { props.changeRoadmapLabel(null); }
    else { props.changeRoadmapLabel(color); }
  };

  return (
    <div ref={modalRef} className={classes.Container}>
      <ModalTitle close={props.close} title="Roadmap Label" />
      {LABEL_COLORS.map((color, i) => (
        <div key={i} style={{background: color}} className={classes.Color} onClick={() => colorHandler(color)}>
          <span>{props.currentLabel === color && checkIcon}</span>
        </div>
      ))}
    </div>
  );
};

RoadmapLabelModal.propTypes = {
  close: PropTypes.func.isRequired,
  currentLabel: PropTypes.string,
  changeRoadmapLabel: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentLabel: state.lists.currentCard.roadmapLabel
});

const mapDispatchToProps = dispatch => ({
  changeRoadmapLabel: color => dispatch(changeRoadmapLabel(color))
});

export default connect(mapStateToProps, mapDispatchToProps)(RoadmapLabelModal);
