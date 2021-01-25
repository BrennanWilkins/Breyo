import React, { useRef, useState } from 'react';
import classes from './Inputs.module.css';
import { checkIcon, uploadIcon, xIcon } from '../icons';
import PropTypes from 'prop-types';
import { isEmail, getEmails } from '../../../utils/authValidation';

export const Checkbox = props => (
  <div className={props.checked ? classes.CheckboxCheck : classes.Checkbox} onClick={props.clicked}>{checkIcon}</div>
);

export const FileInput = props => {
  const fileInput = useRef();

  return (
    <div className={classes.FileBtn}>
      <input ref={fileInput} type="file" accept="image/*" tabIndex="-1" onChange={e => props.change(e.target.files[0])} />
      <div onClick={() => fileInput.current.click()}>{uploadIcon} {props.title}</div>
    </div>
  );
};

export const EmailChipInput = props => {
  const [inputVal, setInputVal] = useState('');
  const [errMsg, setErrMsg] = useState(null);

  const isValid = email => {
    let error = null;
    if (props.emails.includes(email)) {
      error = `'${email}' has already been added.`;
    }
    if (!isEmail(email)) {
      error = `'${email}' is not a valid email address.`;
    }
    if (error) {
      setErrMsg(error);
      return false;
    }
    return true;
  };

  const changeHandler = e => {
    setErrMsg(null);
    setInputVal(e.target.value);
  };

  const keyDownHandler = e => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();
      const val = inputVal.trim();
      if (val && isValid(val)) {
        props.setEmails([...props.emails, val]);
        setInputVal('');
      }
    }
  };

  const deleteHandler = email => {
    props.setEmails(props.emails.filter(e => e !== email));
  };

  const pasteHandler = e => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const pastedEmails = getEmails(pasteData);
    if (pastedEmails) {
      const newEmails = pastedEmails.filter(email => !props.emails.includes(email));
      props.setEmails([...props.emails, ...newEmails]);
    }
  };

  return (
    <>
      {props.label ?
        <label>
          <div>{props.label}</div>
          <input className={classes.EmailInput} value={inputVal} onKeyDown={keyDownHandler} onChange={changeHandler} onPaste={pasteHandler} />
        </label>
        : <input className={classes.EmailInput} value={inputVal} onKeyDown={keyDownHandler} onChange={changeHandler} onPaste={pasteHandler} />}
      {props.subText && <div className={classes.SubText}>{props.subText}</div>}
      <div className={props.fromCreateTeam ? classes.Emails : null}>
        {props.emails.map(email => (
          <div className={classes.EmailChip} key={email}>
            {email}
            <button className={classes.ChipDeleteBtn} onClick={() => deleteHandler(email)}>{xIcon}</button>
          </div>
        ))}
      </div>
      {errMsg && <div className={props.fromCreateTeam ? classes.ErrMsgTeam : classes.ErrMsg}>{errMsg}</div>}
    </>
  );
};

EmailChipInput.propTypes = {
  emails: PropTypes.array.isRequired,
  setEmails: PropTypes.func.isRequired,
  label: PropTypes.string,
  subText: PropTypes.string,
  fromCreateTeam: PropTypes.bool
};

export const Input = props => (
  <input value={props.value} type={props.type || 'text'} onChange={props.onChange}
  className={`${classes.Input} ${props.className || ''}`} placeholder={props.placeholder || ''}
  autoFocus={props.autoFocus} />
);

Input.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool
};
