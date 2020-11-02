import React, { useState } from 'react';
import classes from './CardOptions.module.css';
import { checklistIcon, labelIcon, clockIcon } from '../../../UI/icons';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import LabelModal from '../LabelModal/LabelModal';
import DueDateModal from '../DueDateModal/DueDateModal';

const CardOptions = props => {
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showDueDateModal, setShowDueDateModal] = useState(false);

  return (
    <div className={classes.Container}>
      <div className={classes.Title}>ADD TO CARD</div>
      <span className={classes.BtnContainer}>
        <span className={classes.Btn}><ActionBtn clicked={() => setShowLabelModal(true)}>{labelIcon}Labels</ActionBtn></span>
        {showLabelModal && <LabelModal close={() => setShowLabelModal(false)} />}
      </span>
      <span className={classes.Btn}><ActionBtn>{checklistIcon}Checklist</ActionBtn></span>
      <span className={classes.Btn}><ActionBtn clicked={() => setShowDueDateModal(true)}>{clockIcon}Due Date</ActionBtn></span>
      {showDueDateModal && <DueDateModal close={() => setShowDueDateModal(false)} />}
    </div>
  );
};

export default CardOptions;
