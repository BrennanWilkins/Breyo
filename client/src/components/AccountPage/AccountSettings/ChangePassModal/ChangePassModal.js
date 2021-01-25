import React, { useState, useEffect } from 'react';
import classes from './ChangePassModal.module.css';
import PropTypes from 'prop-types';
import { changePassValidation } from '../../../../utils/authValidation';
import { instance as axios } from '../../../../axios';
import { eyeIcon, eyeHideIcon, checkIcon } from '../../../UI/icons';
import { Input } from '../../../UI/Inputs/Inputs';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';

const ChangePassModal = props => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);

  const saveHandler = async () => {
    const isInvalid = changePassValidation(oldPass, newPass, confirmPass);
    if (!isInvalid) {
      setErr(false);
      setErrMsg('');
    } else {
      setErr(true);
      return setErrMsg(isInvalid);
    }
    try {
      setLoading(true);
      await axios.post('/auth/changePass', { newPassword: newPass, oldPassword: oldPass, confirmPassword: confirmPass });
      setLoading(false);
      setChangeSuccess(true);
    } catch (err) {
      setLoading(false);
      setErr(true);
      const msg = err?.response?.data?.msg || 'There was an error while changing your password.';
      setErrMsg(msg);
    }
  };

  useEffect(() => { setErr(false); setChangeSuccess(false); }, [oldPass, newPass, confirmPass]);

  return (
    <ModalContainer className={classes.Container} close={props.close} title="Change my password">
      <div className={classes.Label}>Old password</div>
      <Input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} />
      <div className={classes.Label}>New password</div>
      <div className={classes.NewPassContainer}>
        <Input type={showNewPass ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)} />
        <div onClick={() => setShowNewPass(prev => !prev)} className={classes.EyeIcon}>{showNewPass ? eyeHideIcon : eyeIcon}</div>
      </div>
      <div className={classes.Label}>Confirm password</div>
      <Input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
      <button disabled={err || loading || changeSuccess} className={classes.SaveBtn} onClick={saveHandler}>Save</button>
      <div className={err ? classes.ErrMsg : classes.HideErrMsg}>{errMsg}</div>
      {changeSuccess && <div className={classes.SuccessMsg}>{checkIcon} Password successfully changed</div>}
    </ModalContainer>
  );
};

ChangePassModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default ChangePassModal;
