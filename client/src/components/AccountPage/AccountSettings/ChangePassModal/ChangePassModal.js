import React, { useRef, useState, useEffect } from 'react';
import classes from './ChangePassModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import { CloseBtn } from '../../../UI/Buttons/Buttons';
import { changePassValidation } from '../../../../utils/authValidation';
import { instance as axios } from '../../../../axios';
import { eyeIcon, eyeHideIcon, checkIcon } from '../../../UI/icons';

const ChangePassModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);

  const saveHandler = async () => {
    const validation = changePassValidation(oldPass, newPass, confirmPass);
    if (validation === '') {
      setErr(false);
      setErrMsg('');
    } else {
      setErr(true);
      return setErrMsg(validation);
    }
    try {
      setLoading(true);
      await axios.post('/auth/changePass', { newPassword: newPass, oldPassword: oldPass, confirmPassword: confirmPass });
      setLoading(false);
      setChangeSuccess(true);
    } catch (err) {
      setLoading(false);
      setErr(true);
      if (err.response && err.response.data.msg) { setErrMsg(err.response.data.msg); }
      else { setErrMsg('There was an error while changing your password.'); }
    }
  };

  useEffect(() => { setErr(false); setChangeSuccess(false); }, [oldPass, newPass, confirmPass]);

  return (
    <div className={classes.Container} ref={modalRef}>
      <div className={classes.Title}>Change my password<span className={classes.CloseBtn}><CloseBtn close={props.close} /></span></div>
      <div className={classes.Label}>Old password</div>
      <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} />
      <div className={classes.Label}>New password</div>
      <div className={classes.NewPassContainer}>
        <input type={showNewPass ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)} />
        <div onClick={() => setShowNewPass(prev => !prev)} className={classes.EyeIcon}>{showNewPass ? eyeHideIcon : eyeIcon}</div>
      </div>
      <div className={classes.Label}>Confirm password</div>
      <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
      <button disabled={err || loading || changeSuccess} className={classes.SaveBtn} onClick={saveHandler}>Save</button>
      <div className={err ? classes.ErrMsg : classes.HideErrMsg}>{errMsg}</div>
      {changeSuccess && <div className={classes.SuccessMsg}>{checkIcon} Password successfully changed</div>}
    </div>
  );
};

ChangePassModal.propTypes = {
  close: PropTypes.func.isRequired
};

export default ChangePassModal;
