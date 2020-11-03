import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './CardChecklist.module.css';
import { checklistIcon } from '../../../UI/icons';
import { ActionBtn } from '../../../UI/Buttons/Buttons';
import { Checkbox } from '../../../UI/Inputs/Inputs';
import { connect } from 'react-redux';
import DeleteModal from './DeleteModal/DeleteModal';
import ProgressBar from './ProgressBar/ProgressBar';
import Item from './ChecklistItem/ChecklistItem';
import AddItem from './AddItem/AddItem';
import { deleteChecklist, toggleChecklistItemIsComplete, deleteChecklistItem,
editChecklistItem } from '../../../../store/actions';

const CardChecklist = props => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [shownItems, setShownItems] = useState(props.items);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (hideCompleted) { setShownItems(props.items.filter(item => !item.isComplete)); }
    else { setShownItems(props.items); }
  }, [props.items, hideCompleted]);

  useEffect(() => {
    const total = props.items.length;
    if (total === 0) { return; }
    const completed = props.items.filter(item => item.isComplete).length;
    setProgress(completed / total);
  }, [props.items]);

  const deleteHandler = () => {
    props.delete(props.checklistID, props.cardID, props.listID, props.boardID);
  };

  const toggleItemCompleteHandler = itemID => {
    props.toggleItem(itemID, props.checklistID, props.cardID, props.listID, props.boardID);
  };

  const deleteItemHandler = itemID => {
    props.deleteItem(itemID, props.checklistID, props.cardID, props.listID, props.boardID);
  };

  const editItemHandler = (title, itemID) => {
    props.editItem(title, itemID, props.checklistID, props.cardID, props.listID, props.boardID);
  };

  return (
    <div>
      <div className={classes.Title}>
        <div className={classes.TitleLeft}>{checklistIcon}Checklist {props.title}</div>
        <div>
          {progress !== 0 && <ActionBtn clicked={() => setHideCompleted(prev => !prev)}>{hideCompleted ? 'Show' : 'Hide'} completed items</ActionBtn>}
          <span className={classes.BtnContainer}>
            <ActionBtn clicked={() => setShowDeleteModal(true)}>Delete</ActionBtn>
            {showDeleteModal && <DeleteModal delete={deleteHandler} title={props.title} close={() => setShowDeleteModal(false)} />}
          </span>
        </div>
      </div>
      <ProgressBar progress={progress} />
      {shownItems.map(item => (
        <Item key={item.itemID} {...item}
          toggleItemComplete={() => toggleItemCompleteHandler(item.itemID)}
          deleteItem={() => deleteItemHandler(item.itemID)}
          editItem={title => editItemHandler(title, item.itemID)} />
      ))}
      {!showAddItem && <div className={classes.AddBtn}><ActionBtn clicked={() => setShowAddItem(true)}>Add an item</ActionBtn></div>}
      {showAddItem && <AddItem close={() => setShowAddItem(false)} checklistID={props.checklistID} cardID={props.cardID} listID={props.listID} boardID={props.boardID} />}
    </div>
  );
};

CardChecklist.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  cardID: PropTypes.string.isRequired,
  listID: PropTypes.string.isRequired,
  boardID: PropTypes.string.isRequired,
  delete: PropTypes.func.isRequired,
  checklistID: PropTypes.string.isRequired,
  toggleItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  delete: (checklistID, cardID, listID, boardID) => dispatch(deleteChecklist(checklistID, cardID, listID, boardID)),
  toggleItem: (itemID, checklistID, cardID, listID, boardID) => dispatch(toggleChecklistItemIsComplete(itemID, checklistID, cardID, listID, boardID)),
  deleteItem: (itemID, checklistID, cardID, listID, boardID) => dispatch(deleteChecklistItem(itemID, checklistID, cardID, listID, boardID)),
  editItem: (title, itemID, checklistID, cardID, listID, boardID) => dispatch(editChecklistItem(title, itemID, checklistID, cardID, listID, boardID))
});

export default connect(null, mapDispatchToProps)(CardChecklist);
