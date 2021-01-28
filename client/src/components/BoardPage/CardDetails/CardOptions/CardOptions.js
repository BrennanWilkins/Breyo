import React, { useState } from 'react';
import classes from './CardOptions.module.css';
import PropTypes from 'prop-types';
import { checklistIcon, labelIcon, clockIcon, copyIcon, archiveIcon, personIcon,
  roadmapIcon, arrowIcon, customFieldIcon } from '../../../UI/icons';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import LabelModal from '../LabelModal/LabelModal';
import DueDateModal from '../DueDateModal/DueDateModal';
import ChecklistModal from '../ChecklistModal/ChecklistModal';
import CopyCardModal from '../CopyCardModal/CopyCardModal';
import AddCardMember from '../AddCardMember/AddCardMember';
import RoadmapLabelModal from '../RoadmapLabelModal/RoadmapLabelModal';
import ManualMoveModal from '../ManualMoveModal/ManualMoveModal';
import CustomFieldModal from '../CustomFieldModal/CustomFieldModal';

const CardOptions = props => {
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showDueDateModal, setShowDueDateModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showRoadmapLabelModal, setShowRoadmapLabelModal] = useState(false);
  const [showManualMoveModal, setShowManualMoveModal] = useState(false);
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);

  return (
    <div className={classes.Container}>
      <div className={classes.Title}>ADD TO CARD</div>
      <span className={classes.BtnContainer}>
        <ActionBtn className={classes.Btn} clicked={() => setShowLabelModal(true)}>{labelIcon}Labels</ActionBtn>
        {showLabelModal && <LabelModal close={() => setShowLabelModal(false)} />}
        <ActionBtn className={classes.Btn} clicked={() => setShowChecklistModal(true)}>{checklistIcon}Checklist</ActionBtn>
        {showChecklistModal && <ChecklistModal close={() => setShowChecklistModal(false)} />}
        <ActionBtn className={classes.Btn} clicked={() => setShowAddMemberModal(true)}>{personIcon}Member</ActionBtn>
        {showAddMemberModal && <AddCardMember close={() => setShowAddMemberModal(false)} />}
        <ActionBtn className={classes.Btn} clicked={() => setShowDueDateModal(true)}>{clockIcon}Due Date</ActionBtn>
        {showCustomFieldModal && <CustomFieldModal close={() => setShowCustomFieldModal(false)} />}
        <ActionBtn className={`${classes.Btn} ${classes.CustomFieldBtn}`} clicked={() => setShowCustomFieldModal(true)}>{customFieldIcon}Custom Field</ActionBtn>
        <span className={classes.RoadmapBtnContainer}>
          <ActionBtn className={`${classes.Btn} ${classes.RoadmapBtn}`} clicked={() => setShowRoadmapLabelModal(true)}>{roadmapIcon}Roadmap Label</ActionBtn>
          {showRoadmapLabelModal && <RoadmapLabelModal close={() => setShowRoadmapLabelModal(false)} />}
        </span>
      </span>
      <div className={classes.Title2}>ACTIONS</div>
      <span className={classes.BtnContainer2}>
        <ActionBtn className={classes.Btn} clicked={() => setShowManualMoveModal(true)}>{arrowIcon} Move</ActionBtn>
        <ActionBtn className={classes.Btn} clicked={() => setShowCopyModal(true)}>{copyIcon} Copy</ActionBtn>
        <ActionBtn className={classes.Btn} clicked={props.archiveCard}>{archiveIcon} Archive</ActionBtn>
      </span>
      {showCopyModal && <CopyCardModal close={() => setShowCopyModal(false)} />}
      {showDueDateModal && <DueDateModal close={() => setShowDueDateModal(false)} />}
      {showManualMoveModal && <ManualMoveModal close={() => setShowManualMoveModal(false)} />}
    </div>
  );
};

CardOptions.propTypes = {
  archiveCard: PropTypes.func.isRequired
};

export default CardOptions;
