import React from 'react';
import PropTypes from 'prop-types';
import classes from './RoadmapLabelModal.module.css';
import { LABEL_COLORS } from '../../../../utils/backgrounds';
import { checkIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import { changeRoadmapLabel } from '../../../../store/actions';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';

const RoadmapLabelModal = props => {
  const colorHandler = color => {
    if (props.currentLabel === color) { props.changeRoadmapLabel(null); }
    else { props.changeRoadmapLabel(color); }
  };

  return (
    <ModalContainer className={classes.Container} close={props.close} title="Roadmap Label">
      {LABEL_COLORS.map((color, i) => (
        <div key={i} style={{background: color}} className={classes.Color} onClick={() => colorHandler(color)}>
          <span>{props.currentLabel === color && checkIcon}</span>
        </div>
      ))}
    </ModalContainer>
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
