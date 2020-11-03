import React, { useState } from 'react';
import classes from './ChecklistItem.module.css';
import { Checkbox } from '../../../../UI/Inputs/Inputs';
import PropTypes from 'prop-types';
import { CloseBtn } from '../../../../UI/Buttons/Buttons';
import { editIcon } from '../../../../UI/icons';
import SubmitBtns from '../../../../UI/SubmitBtns/SubmitBtns';
import TextArea from 'react-textarea-autosize';

const ChecklistItem = props => {
  const [showEdit, setShowEdit] = useState(false);
  const [itemTitle, setItemTitle] = useState(props.title);

  const editHandler = () => {
    if (itemTitle === '' || itemTitle.length > 200) { return setItemTitle(props.title); }
    props.editItem(itemTitle);
    setShowEdit(false);
  };

  return (
    <div className={classes.Container}>
      <Checkbox checked={props.isComplete} clicked={props.toggleItemComplete} />
      {!showEdit ? <>
      <span className={props.isComplete ? classes.TitleCompleted : classes.Title}>{props.title}</span>
      <div className={classes.Btns}>
        <span className={classes.EditBtn} onClick={() => setShowEdit(true)}>{editIcon}</span>
        <span className={classes.CloseBtn}><CloseBtn close={props.deleteItem} /></span>
      </div></> :
      <div className={classes.EditItem}>
        <form onSubmit={editHandler}>
          <TextArea maxRows="5" value={itemTitle} onChange={e => setItemTitle(e.target.value)} className={classes.Input}
          onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault(); editHandler(); }}} autoFocus />
          <SubmitBtns close={() => setShowEdit(false)} text="Edit" />
        </form>
      </div>}
    </div>
  );
};

ChecklistItem.propTypes = {
  title: PropTypes.string.isRequired,
  isComplete: PropTypes.bool.isRequired,
  toggleItemComplete: PropTypes.func.isRequired
};

export default ChecklistItem;
