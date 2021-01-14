import React, { useState } from 'react';
import classes from './CardLabels.module.css';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { plusIcon } from '../../../UI/icons';
import LabelModal from '../LabelModal/LabelModal';
import PropTypes from 'prop-types';
import { LABEL_COLORS } from '../../../../utils/backgrounds';

const CardLabels = props => {
  const [showLabelModal, setShowLabelModal] = useState(false);

  return (
    <div className={classes.Container}>
      <div className={classes.Title}>LABELS</div>
      <div className={classes.Labels}>
        {LABEL_COLORS.filter(color => props.labels.includes(color)).map(color => <div key={color} className={classes.Label} style={{background: color}}></div>)}
        <div className={classes.Btn}>
          <ActionBtn className={classes.AddBtn} clicked={() => setShowLabelModal(true)}>{plusIcon}</ActionBtn>
          {showLabelModal && <LabelModal openFromMiddle close={() => setShowLabelModal(false)} />}
        </div>
      </div>
    </div>
  );
};

CardLabels.propTypes = {
  labels: PropTypes.array.isRequired
};

export default CardLabels;
