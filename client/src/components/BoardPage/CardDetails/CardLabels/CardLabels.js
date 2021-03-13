import React, { useState } from 'react';
import classes from './CardLabels.module.css';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { plusIcon } from '../../../UI/icons';
import LabelModal from '../LabelModal/LabelModal';
import PropTypes from 'prop-types';
import { LABEL_COLORS } from '../../../../utils/backgrounds';
import { connect } from 'react-redux';

const CardLabels = props => {
  const [showLabelModal, setShowLabelModal] = useState(false);

  return (
    <div className={classes.Container}>
      <div className={classes.Title}>LABELS</div>
      <div className={classes.Labels}>
        {props.customLabels.map(labelID => {
          const label = props.customLabelsByID[labelID];
          return (
            <div key={labelID} title={label.title} onClick={() => setShowLabelModal(true)}
            className={classes.CustomLabel} style={{ background: label.color }}>
              {label.title}
            </div>
          );
        })}
        {LABEL_COLORS.filter(color => props.labels.includes(color)).map(color => (
          <div key={color} className={classes.Label} onClick={() => setShowLabelModal(true)} style={{background: color}} />
        ))}
        <div className={classes.Btn}>
          <ActionBtn className={classes.AddBtn} clicked={() => setShowLabelModal(true)}>{plusIcon}</ActionBtn>
          {showLabelModal && <LabelModal openFromMiddle close={() => setShowLabelModal(false)} />}
        </div>
      </div>
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
