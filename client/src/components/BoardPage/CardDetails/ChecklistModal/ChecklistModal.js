import React, { useState } from 'react';
import classes from './ChecklistModal.module.css';
import PropTypes from 'prop-types';
import Button from '../../../UI/Buttons/Buttons';
import { connect } from 'react-redux';
import { addChecklist } from '../../../../store/actions';
import { Input } from '../../../UI/Inputs/Inputs';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';

const ChecklistModal = props => {
  const [title, setTitle] = useState('');

  const addHandler = () => {
    if (!title || title.length > 200) { return; }
    props.close();
    props.addChecklist(title);
  };

  return (
    <ModalContainer className={classes.Container} title="Add a checklist" close={props.close}>
      <Input className={classes.Input} autoFocus value={title} onChange={e => setTitle(e.target.value)}
      placeholder="Enter a title for the checklist" />
      <span className={classes.AddBtn}><Button disabled={!title} clicked={addHandler}>Add</Button></span>
    </ModalContainer>
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
