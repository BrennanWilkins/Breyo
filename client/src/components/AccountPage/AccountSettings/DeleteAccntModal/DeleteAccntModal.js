import React, { useState, useRef } from 'react';
import classes from './DeleteAccntModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteAccount } from '../../../../store/actions';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';
import { Input } from '../../../UI/Inputs/Inputs';

const DeleteAccntModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [password, setPassword] = useState('');

  const deleteHandler = () => {
    if (password === '') { return; }
    props.deleteAccount(password);
  };

  return (
    <div className={classes.Container} ref={modalRef}>
      <ModalTitle close={props.close} title="Delete my account" />
      <div className={classes.Info}>
        Deleting your account cannot be undone. Any boards in which you are the only member will be deleted, and any boards in which you are the only
        admin will result in all other members being promoted to admin.
      </div>
      <p>To confirm, please enter your password below.</p>
      <Input className={classes.Input} type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className={classes.DeleteBtn} onClick={deleteHandler}>DELETE MY ACCOUNT</button>
    </div>
  );
};

DeleteAccntModal.propTypes = {
  close: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  deleteAccount: pass => dispatch(deleteAccount(pass))
});

export default connect(null, mapDispatchToProps)(DeleteAccntModal);
