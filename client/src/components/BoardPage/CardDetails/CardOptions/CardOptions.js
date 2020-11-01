import React, { useState } from 'react';
import classes from './CardOptions.module.css';
import { checklistIcon, labelIcon, clockIcon } from '../../../UI/icons';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import LabelModal from '../LabelModal/LabelModal';

const CardOptions = props => {
  const [showLabelModal, setShowLabelModal] = useState(false);

  return (
    <div className={classes.Container}>
      <div className={classes.Title}>ADD TO CARD</div>
      <span className={classes.LabelBtn}>
        <span className={classes.Btn}><ActionBtn clicked={() => setShowLabelModal(true)}>{labelIcon}Labels</ActionBtn></span>
        {showLabelModal && <LabelModal close={() => setShowLabelModal(false)} />}
      </span>
      <span className={classes.Btn}><ActionBtn>{checklistIcon}Checklist</ActionBtn></span>
      <span className={classes.Btn}><ActionBtn>{clockIcon}Due Date</ActionBtn></span>
    </div>
  );
};

export default CardOptions;
