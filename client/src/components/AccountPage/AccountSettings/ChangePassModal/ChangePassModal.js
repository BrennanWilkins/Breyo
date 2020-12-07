import React, { useRef, useState } from 'react';
import classes from './ChangePassModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import { CloseBtn } from '../../../UI/Buttons/Buttons';

const ChangePassModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const saveHandler = () => {

  };

  return (
    <div className={classes.Container} ref={modalRef}>
      <div className={classes.Title}>Change my password<span className={classes.CloseBtn}><CloseBtn close={props.close} /></span></div>
      <div className={classes.Label}>Old password</div>
      <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} />
      <div className={classes.Label}>New password</div>
      <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
      <div className={classes.Label}>Confirm password</div>
      <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
      <button className={classes.SaveBtn} onClick={saveHandler}>Save</button>
    </div>
  );
};

ChangePassModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default ChangePassModal;
