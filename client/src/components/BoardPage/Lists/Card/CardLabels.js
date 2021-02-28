import React from 'react';
import classes from './Card.module.css';
import PropTypes from 'prop-types';
import { LABEL_COLORS } from '../../../../utils/backgrounds';
import { connect } from 'react-redux';

const CardLabels = props => {
  return (
    <div className={classes.Labels}>
      {props.customLabels.map(labelID => <div key={labelID} style={{ background: props.customLabelsByID[labelID].color }} />)}
      {LABEL_COLORS.filter(color => props.labels.includes(color)).map(color => <div key={color} style={{ background: color }} />)}
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
