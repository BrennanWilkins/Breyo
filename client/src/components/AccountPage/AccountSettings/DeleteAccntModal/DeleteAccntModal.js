import React, { useState, useRef } from 'react';
import classes from './DeleteAccntModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteAccount } from '../../../../store/actions';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';

const DeleteAccntModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [inputVal, setInputVal] = useState('');

  const deleteHandler = () => {
    if (inputVal !== 'DELETE MY ACCOUNT FOREVER') { return; }
    props.deleteAccount();
  };

  return (
    <div className={classes.Container} ref={modalRef}>
      <ModalTitle close={props.close} title="Delete my account" />
      <div className={classes.Info}>
        Deleting your account cannot be undone. Any boards in which you are the only member will be deleted, and any boards in which you are the only
        admin will result in all other members being promoted to admin.
      </div>
      <div className={classes.Info}>If you are sure you would like to do this, please type 'DELETE MY ACCOUNT FOREVER' below.</div>
      <input className={classes.Input} value={inputVal} onChange={e => setInputVal(e.target.value)} />
      <button className={classes.DeleteBtn} onClick={deleteHandler}>DELETE MY ACCOUNT</button>
    </div>
  );
};

DeleteAccntModal.propTypes = {
  close: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  deleteAccount: () => dispatch(deleteAccount())
});

export default connect(null, mapDispatchToProps)(DeleteAccntModal);
