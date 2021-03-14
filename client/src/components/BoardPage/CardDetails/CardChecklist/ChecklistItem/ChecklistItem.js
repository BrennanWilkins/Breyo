import React, { useState, useRef } from 'react';
import classes from './ChecklistItem.module.css';
import { Checkbox } from '../../../../UI/Inputs/Inputs';
import PropTypes from 'prop-types';
import { CloseBtn, AccountBtn } from '../../../../UI/Buttons/Buttons';
import { editIcon, personPlusIcon, clockIcon } from '../../../../UI/icons';
import { Draggable } from 'react-beautiful-dnd';
import EditChecklistItem from './EditChecklistItem';
import { format } from 'date-fns';

const ChecklistItem = props => {
  const [showEdit, setShowEdit] = useState(false);
  const checkboxRef = useRef();

  const getDragStyle = (isDragging, otherStyles) => {
    if (isDragging) { return { background: 'rgb(235, 235, 235)', ...otherStyles }; }
    else { return otherStyles; }
  };

  const checkboxClickHandler = () => {
    props.toggleItemComplete();
    if (showEdit) { setShowEdit(false); }
  };

  return (
    <Draggable draggableId={props.itemID} index={props.index}>
      {(provided, snapshot) => (
        <div className={classes.Container} ref={provided.innerRef}
        {...provided.draggableProps} {...provided.dragHandleProps} style={getDragStyle(snapshot.isDragging, provided.draggableProps.style)}>
          <Checkbox cbRef={checkboxRef} checked={props.isComplete} clicked={checkboxClickHandler} />
          {!showEdit ? <>
          <span onClick={() => setShowEdit(true)} className={props.isComplete ? classes.TitleCompleted : classes.Title}>{props.title}</span>
          <div className={classes.Btns}>
            <span className={classes.Btn} onClick={() => setShowEdit(true)}>{editIcon}</span>
            <span className={props.dueDate ? classes.DueDate : classes.Btn} onClick={props.showChangeDueDate}>
              {clockIcon}{!!props.dueDate && format(new Date(props.dueDate), 'MMM d')}
            </span>
            {props.member ?
              <AccountBtn clicked={props.showChangeMember}
              className={classes.AccountBtn} avatar={props.memberAvatar}>
                {props.member.fullName[0]}
              </AccountBtn>
              :
              <span className={classes.Btn} style={{ fontSize: '16px' }}
              onClick={props.showChangeMember}>
                {personPlusIcon}
              </span>
            }
            <CloseBtn className={classes.CloseBtn} close={props.deleteItem} />
          </div></> :
          <EditChecklistItem checkboxRef={checkboxRef} close={() => setShowEdit(false)} editItem={props.editItem} title={props.title} />}
        </div>
      )}
    </Draggable>
  );
};

ChecklistItem.propTypes = {
  title: PropTypes.string.isRequired,
  isComplete: PropTypes.bool.isRequired,
  toggleItemComplete: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  itemID: PropTypes.string.isRequired,
  showChangeMember: PropTypes.func.isRequired,
  member: PropTypes.object,
  memberAvatar: PropTypes.string,
  dueDate: PropTypes.string,
  showChangeDueDate: PropTypes.func.isRequired
};

export default ChecklistItem;
