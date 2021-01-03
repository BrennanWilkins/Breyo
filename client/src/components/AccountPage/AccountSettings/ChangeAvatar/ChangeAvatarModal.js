import React, { useRef } from 'react';
import classes from './ChangeAvatar.module.css';
import PropTypes from 'prop-types';
import { useModalToggle } from '../../../../utils/customHooks';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';
import { checkIcon, uploadIcon } from '../../../UI/icons';
import { AccountBtn } from '../../../UI/Buttons/Buttons';
import Spinner from '../../../UI/AuthSpinner/AuthSpinner';
import { FileInput } from '../../../UI/Inputs/Inputs';

const ChangeAvatarModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div className={classes.Modal} ref={modalRef}>
      <ModalTitle close={props.close} title="Change avatar" />
      <div className={`${classes.Option} ${!props.selectedPic ? classes.Selected: ''}`} onClick={() => props.setPic(null)}>
        <AccountBtn>{props.fullName[0]}</AccountBtn> No avatar{!props.selectedPic && checkIcon}
      </div>
      {(props.avatar && !props.picSelected) && <div className={`${classes.Option} ${props.selectedPic === props.avatar ? classes.Selected: ''}`}
      onClick={() => props.setPic('current')}>
        <AccountBtn avatar={props.avatar}></AccountBtn> Current picture {props.selectedPic === props.avatar && checkIcon}
      </div>}
      {props.picSelected && <div className={`${classes.Option} ${classes.Selected}`}>
        <AccountBtn avatar={props.selectedPic}></AccountBtn> Selected picture {checkIcon}
      </div>}
      <FileInput change={pic => props.setPic(pic)} title="Upload a picture" />
      {props.loading && <div className={classes.Spinner}><Spinner /></div>}
      {props.err && <div className={classes.ErrMsg}>There was an error while uploading your picture.</div>}
    </div>
  );
};

ChangeAvatarModal.propTypes = {
  close: PropTypes.func.isRequired,
  setPic: PropTypes.func.isRequired,
  selectedPic: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  err: PropTypes.bool.isRequired,
  avatar: PropTypes.string,
  picSelected: PropTypes.bool.isRequired
};

export default ChangeAvatarModal;
