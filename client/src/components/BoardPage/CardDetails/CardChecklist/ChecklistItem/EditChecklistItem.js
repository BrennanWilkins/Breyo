import React, { useState, useRef } from 'react';
import classes from './ChecklistItem.module.css';
import { useModalToggleMultiple } from '../../../../../utils/customHooks';
import TextArea from 'react-textarea-autosize';
import PropTypes from 'prop-types';
import SubmitBtns from '../../../../UI/SubmitBtns/SubmitBtns';

const EditChecklistItem = props => {
  const [itemTitle, setItemTitle] = useState(props.title);
  const formRef = useRef();
  useModalToggleMultiple(true, [formRef, props.checkboxRef], props.close);

  const keyPressHandler = e => {
    if (e.key === 'Enter') { editHandler(e); }
  };

  const editHandler = e => {
    e.preventDefault();
    if (!itemTitle || itemTitle.length > 300) { return setItemTitle(props.title); }
    props.editItem(itemTitle);
    props.close();
  };

  const inputHandler = e => {
    if (e.target.value.length > 300) { return; }
    setItemTitle(e.target.value);
  };

  return (
    <div className={classes.EditItem}>
      <form onSubmit={editHandler} ref={formRef}>
        <TextArea value={itemTitle} onChange={inputHandler} className={classes.Input}
        onKeyPress={keyPressHandler} autoFocus onFocus={e => e.target.select()} />
        <SubmitBtns close={props.close} text="Edit" />
      </form>
    </div>
  );
};

EditChecklistItem.propTypes = {
  close: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  checkboxRef: PropTypes.object
};

export default EditChecklistItem;
