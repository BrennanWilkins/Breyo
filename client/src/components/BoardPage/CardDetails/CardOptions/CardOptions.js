import React, { useState } from 'react';
import classes from './CardOptions.module.css';
import { checklistIcon, labelIcon, clockIcon, copyIcon, archiveIcon, personIcon } from '../../../UI/icons';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import LabelModal from '../LabelModal/LabelModal';
import DueDateModal from '../DueDateModal/DueDateModal';
import ChecklistModal from '../ChecklistModal/ChecklistModal';
import CopyCardModal from '../CopyCardModal/CopyCardModal';
import AddCardMember from '../AddCardMember/AddCardMember';

const CardOptions = props => {
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showDueDateModal, setShowDueDateModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  return (
    <div className={classes.Container}>
      <div className={classes.Title}>ADD TO CARD</div>
      <span className={classes.BtnContainer}>
        <span className={classes.Btn}><ActionBtn clicked={() => setShowLabelModal(true)}>{labelIcon}Labels</ActionBtn></span>
        {showLabelModal && <LabelModal close={() => setShowLabelModal(false)} />}
        <span className={classes.Btn}><ActionBtn clicked={() => setShowChecklistModal(true)}>{checklistIcon}Checklist</ActionBtn></span>
        {showChecklistModal && <ChecklistModal close={() => setShowChecklistModal(false)} />}
        <span className={classes.Btn}><ActionBtn clicked={() => setShowAddMemberModal(true)}>{personIcon}Member</ActionBtn></span>
        {showAddMemberModal && <AddCardMember close={() => setShowAddMemberModal(false)} />}
      </span>
      <span className={classes.Btn}><ActionBtn clicked={() => setShowDueDateModal(true)}>{clockIcon}Due Date</ActionBtn></span>
      <div className={classes.Title2}>ACTIONS</div>
      <span className={classes.Btn}><ActionBtn clicked={() => setShowCopyModal(true)}>{copyIcon} Copy</ActionBtn></span>
      {showCopyModal && <CopyCardModal close={() => setShowCopyModal(false)} />}
      <span className={classes.Btn}><ActionBtn clicked={props.archiveCard}>{archiveIcon} Archive</ActionBtn></span>
      {showDueDateModal && <DueDateModal close={() => setShowDueDateModal(false)} />}
    </div>
  );
};

export default CardOptions;
