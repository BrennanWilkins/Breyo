import React, { useState } from 'react';
import classes from './Card.module.css';
import PropTypes from 'prop-types';
import { LABEL_COLORS } from '../../../../utils/backgrounds';
import { connect } from 'react-redux';

const CardLabels = props => {
  const [labelsHovered, setLabelsHovered] = useState(false);
  const [expandLabels, setExpandLabels] = useState(false);

  const clickHandler = e => {
    e.stopPropagation();
    setExpandLabels(prev => !prev);
  };

  return (
    <div className={classes.Labels}>
      {props.customLabels.map(labelID => (
        <div key={labelID} className={`${classes.Label} ${labelsHovered ? classes.DarkenLabel : ''} ${expandLabels ? classes.ExpandLabel : ''}`}
        onClick={clickHandler} onMouseEnter={() => setLabelsHovered(true)} onMouseLeave={() => setLabelsHovered(false)}
        style={{ background: props.customLabelsByID[labelID].color }}>
          <div className={classes.LabelTitle}><span>{props.customLabelsByID[labelID].title}</span></div>
        </div>
      ))}
      {LABEL_COLORS.filter(color => props.labels.includes(color)).map(color => (
        <div key={color} className={`${classes.Label} ${labelsHovered ? classes.DarkenLabel : ''} ${expandLabels ? classes.ExpandLabel : ''}`}
        onClick={clickHandler} onMouseEnter={() => setLabelsHovered(true)} onMouseLeave={() => setLabelsHovered(false)}
        style={{ background: color }}>
          <div className={classes.LabelTitle} />
        </div>
      ))}
    </div>
  );
};

CardLabels.propTypes = {
  labels: PropTypes.array.isRequired,
  customLabels: PropTypes.array.isRequired,
  customLabelsByID: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  customLabelsByID: state.board.customLabels.byID
});

export default connect(mapStateToProps)(CardLabels);
