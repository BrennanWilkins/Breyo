import React, { useState, useRef } from 'react';
import classes from './ChecklistItem.module.css';
import { Checkbox } from '../../../../UI/Inputs/Inputs';
import PropTypes from 'prop-types';
import { CloseBtn } from '../../../../UI/Buttons/Buttons';
import { editIcon } from '../../../../UI/icons';
import SubmitBtns from '../../../../UI/SubmitBtns/SubmitBtns';
import TextArea from 'react-textarea-autosize';
import { useModalToggle } from '../../../../../utils/customHooks';
import { Draggable } from 'react-beautiful-dnd';

const ChecklistItem = props => {
  const [showEdit, setShowEdit] = useState(false);
  const [itemTitle, setItemTitle] = useState(props.title);
  const formRef = useRef();

  const closeHandler = () => {
    setShowEdit(false);
    setItemTitle(props.title);
  };

  useModalToggle(showEdit, formRef, closeHandler);

  const editHandler = e => {
    e.preventDefault();
    if (itemTitle === '' || itemTitle.length > 300) { return setItemTitle(props.title); }
    props.editItem(itemTitle);
    setShowEdit(false);
  };

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
            <span className={classes.CloseBtn}><CloseBtn close={props.deleteItem} /></span>
          </div></> :
          <div className={classes.EditItem}>
            <form onSubmit={editHandler} ref={formRef}>
              <TextArea maxRows="5" value={itemTitle} onChange={e => setItemTitle(e.target.value)} className={classes.Input}
              onKeyPress={e => { if (e.key === 'Enter') { editHandler(e); }}} autoFocus />
              <SubmitBtns close={closeHandler} text="Edit" />
            </form>
          </div>}
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
