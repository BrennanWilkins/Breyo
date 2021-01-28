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
  const [shownModal, setShownModal] = useState(null);

  const closeHandler = () => setShownModal(null);

  return (
    <div className={classes.Container}>
      <div className={classes.Title}>ADD TO CARD</div>
      <span className={classes.BtnContainer}>
        <ActionBtn className={classes.Btn} clicked={() => setShownModal('label')}>{labelIcon}Labels</ActionBtn>
        {shownModal === 'label' && <LabelModal close={closeHandler} />}
        <ActionBtn className={classes.Btn} clicked={() => setShownModal('checklist')}>{checklistIcon}Checklist</ActionBtn>
        {shownModal === 'checklist' && <ChecklistModal close={closeHandler} />}
        <ActionBtn className={classes.Btn} clicked={() => setShownModal('member')}>{personIcon}Member</ActionBtn>
        {shownModal === 'member' && <AddCardMember close={closeHandler} />}
        <ActionBtn className={classes.Btn} clicked={() => setShownModal('date')}>{clockIcon}Due Date</ActionBtn>
        {shownModal === 'custom' && <CustomFieldModal close={closeHandler} />}
        <ActionBtn className={`${classes.Btn} ${classes.CustomFieldBtn}`} clicked={() => setShownModal('custom')}>{customFieldIcon}Custom Field</ActionBtn>
        <span className={classes.RoadmapBtnContainer}>
          <ActionBtn className={`${classes.Btn} ${classes.RoadmapBtn}`} clicked={() => setShownModal('roadmap')}>{roadmapIcon}Roadmap Label</ActionBtn>
          {shownModal === 'roadmap' && <RoadmapLabelModal close={closeHandler} />}
        </span>
      </span>
      <div className={classes.Title2}>ACTIONS</div>
      <span className={classes.BtnContainer2}>
        <ActionBtn className={classes.Btn} clicked={() => setShownModal('move')}>{arrowIcon} Move</ActionBtn>
        <ActionBtn className={classes.Btn} clicked={() => setShownModal('copy')}>{copyIcon} Copy</ActionBtn>
        <ActionBtn className={classes.Btn} clicked={props.archiveCard}>{archiveIcon} Archive</ActionBtn>
      </span>
      {shownModal === 'copy' && <CopyCardModal close={closeHandler} />}
      {shownModal === 'date' && <DueDateModal close={closeHandler} />}
      {shownModal === 'move' && <ManualMoveModal close={closeHandler} />}
    </div>
  );
};

CardOptions.propTypes = {
  archiveCard: PropTypes.func.isRequired
};

export default CardOptions;
