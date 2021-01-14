import React, { useState } from 'react';
import classes from './ChecklistItem.module.css';
import { Checkbox } from '../../../../UI/Inputs/Inputs';
import PropTypes from 'prop-types';
import { CloseBtn } from '../../../../UI/Buttons/Buttons';
import { editIcon } from '../../../../UI/icons';
import { Draggable } from 'react-beautiful-dnd';
import EditChecklistItem from './EditChecklistItem';

const ChecklistItem = props => {
  const [showEdit, setShowEdit] = useState(false);

  const getDragStyle = (isDragging, otherStyles) => {
    if (isDragging) { return { background: 'rgb(235, 235, 235)', ...otherStyles }; }
    else { return otherStyles; }
  };

  return (
    <Draggable draggableId={props.itemID} index={props.index}>
      {(provided, snapshot) => (
        <div className={classes.Container} ref={provided.innerRef}
        {...provided.draggableProps} {...provided.dragHandleProps} style={getDragStyle(snapshot.isDragging, provided.draggableProps.style)}>
          <Checkbox checked={props.isComplete} clicked={props.toggleItemComplete} />
          {!showEdit ? <>
          <span className={props.isComplete ? classes.TitleCompleted : classes.Title}>{props.title}</span>
          <div className={classes.Btns}>
            <span className={classes.EditBtn} onClick={() => setShowEdit(true)}>{editIcon}</span>
            <CloseBtn className={classes.CloseBtn} close={props.deleteItem} />
          </div></> :
          <EditChecklistItem close={() => setShowEdit(false)} editItem={props.editItem} title={props.title} />}
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
  itemID: PropTypes.string.isRequired
};

export default ChecklistItem;
