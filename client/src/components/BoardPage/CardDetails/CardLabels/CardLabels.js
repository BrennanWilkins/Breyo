import React, { useState } from 'react';
import classes from './CardLabels.module.css';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { plusIcon } from '../../../UI/icons';
import LabelModal from '../LabelModal/LabelModal';
import PropTypes from 'prop-types';

const CardLabels = props => {
  const [showLabelModal, setShowLabelModal] = useState(false);

  return (
    <div className={classes.Container}>
      <div className={classes.Title}>LABELS</div>
      <div className={classes.Labels}>
        {props.labels.map(color => <div key={color} className={classes.Label} style={{background: color}}></div>)}
        <div className={classes.Btn}>
          <span className={classes.AddBtn}><ActionBtn clicked={() => setShowLabelModal(true)}>{plusIcon}</ActionBtn></span>
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
