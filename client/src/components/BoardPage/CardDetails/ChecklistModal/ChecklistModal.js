import React, { useRef, useState } from 'react';
import classes from './ChecklistModal.module.css';
import PropTypes from 'prop-types';
import { useModalToggle } from '../../../../utils/customHooks';
import Button, { CloseBtn } from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import { addChecklist } from '../../../../store/actions';

const ChecklistModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [title, setTitle] = useState('');

  const addHandler = () => {
    if (title === '' || title.length > 200) { return; }
    props.close();
    props.addChecklist(title);
  };

  return (
    <div ref={modalRef} className={classes.Container}>
      <div className={classes.Title}>Add a checklist<span className={classes.CloseBtn}><CloseBtn close={props.close} /></span></div>
      <input className={classes.Input} autoFocus value={title} onChange={e => setTitle(e.target.value)}
      placeholder="Enter a title for the checklist" />
      <span className={classes.AddBtn}><Button disabled={title === ''} clicked={addHandler}>Add</Button></span>
    </div>
  );
};

ChecklistModal.propTypes = {
  close: PropTypes.func.isRequired,
  addChecklist: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  addChecklist: title => dispatch(addChecklist(title))
});

export default connect(null, mapDispatchToProps)(ChecklistModal);
