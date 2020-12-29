import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './CardChecklist.module.css';
import { checklistIcon } from '../../../UI/icons';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import DeleteModal from './DeleteModal/DeleteModal';
import ProgressBar from './ProgressBar/ProgressBar';
import Item from './ChecklistItem/ChecklistItem';
import AddItem from './AddItem/AddItem';
import { deleteChecklist, toggleChecklistItemIsComplete, deleteChecklistItem,
editChecklistItem, checklistDndHandler } from '../../../../store/actions';
import EditChecklistTitle from './EditChecklistTitle/EditChecklistTitle';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const CardChecklist = props => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showEditTitle, setShowEditTitle] = useState(false);

  useEffect(() => {
    if (hideCompleted) { setFilteredItems(props.items.filter(item => !item.isComplete)); }
  }, [props.items, hideCompleted]);

  useEffect(() => {
    const total = props.items.length;
    if (total === 0) { return; }
    const completed = props.items.filter(item => item.isComplete).length;
    setProgress(completed / total);
  }, [props.items]);

  const deleteHandler = () => {
    props.delete(props.checklistID);
  };

  const toggleItemCompleteHandler = itemID => {
    props.toggleItem(itemID, props.checklistID);
  };

  const deleteItemHandler = itemID => {
    props.deleteItem(itemID, props.checklistID);
  };

  const editItemHandler = (title, itemID) => {
    props.editItem(title, itemID, props.checklistID);
  };

  const onDragEndHandler = ({ source, destination, draggableId }) => {
    // item dropped in invalid place
    if (!destination) { return; }
    // item dropped in same place
    if (source.index === destination.index) { return; }
    // if completed items hidden, find correct index of item
    let sourceIndex = hideCompleted ? props.items.findIndex(item => item.itemID === draggableId) : source.index;
    let destIndex = destination.index;
    destIndex = hideCompleted ? destIndex + props.items.length - filteredItems.length : destIndex;
    props.dndHandler(sourceIndex, destIndex, props.checklistID);
  };

  const shownItems = hideCompleted ? filteredItems : props.items;

  return (
    <div>
      <div className={classes.TitleContainer}>
        <div className={classes.TitleLeft} style={showEditTitle ? { width: '100%'} : null}>
          <span className={classes.Icon}>{checklistIcon}</span>
          {showEditTitle ? <EditChecklistTitle title={props.title} close={() => setShowEditTitle(false)} checklistID={props.checklistID} /> :
          <span className={classes.Title} onClick={() => setShowEditTitle(true)}>{props.title}</span>}
        </div>
        {!showEditTitle &&
        <div className={classes.TitleRight}>
          {progress !== 0 && <ActionBtn clicked={() => setHideCompleted(prev => !prev)}>{hideCompleted ? 'Show' : 'Hide'} completed items</ActionBtn>}
          <span className={classes.BtnContainer}>
            <ActionBtn clicked={() => setShowDeleteModal(true)}>Delete</ActionBtn>
            {showDeleteModal && <DeleteModal delete={deleteHandler} title={props.title} close={() => setShowDeleteModal(false)} />}
          </span>
        </div>}
      </div>
      <ProgressBar progress={progress} />
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId={props.checklistID} direction="vertical" type="list">
          {(provided, snapshot) => (
            <div ref={provided.innerRef}>
              {shownItems.map((item, i) => (
                <Item key={item.itemID} {...item} index={i} itemID={item.itemID}
                  toggleItemComplete={() => toggleItemCompleteHandler(item.itemID)}
                  deleteItem={() => deleteItemHandler(item.itemID)}
                  editItem={title => editItemHandler(title, item.itemID)} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {!showAddItem && <div className={classes.AddBtn}><ActionBtn clicked={() => setShowAddItem(true)}>Add an item</ActionBtn></div>}
      {showAddItem && <AddItem close={() => setShowAddItem(false)} checklistID={props.checklistID} />}
    </div>
  );
};

CardChecklist.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  delete: PropTypes.func.isRequired,
  checklistID: PropTypes.string.isRequired,
  toggleItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  dndHandler: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  delete: checklistID => dispatch(deleteChecklist(checklistID)),
  toggleItem: (itemID, checklistID) => dispatch(toggleChecklistItemIsComplete(itemID, checklistID)),
  deleteItem: (itemID, checklistID) => dispatch(deleteChecklistItem(itemID, checklistID)),
  editItem: (title, itemID, checklistID) => dispatch(editChecklistItem(title, itemID, checklistID)),
  dndHandler: (sourceIndex, destIndex, checklistID) => dispatch(checklistDndHandler(sourceIndex, destIndex, checklistID))
});

export default connect(null, mapDispatchToProps)(CardChecklist);
