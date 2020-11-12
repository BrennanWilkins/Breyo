import React, { useRef } from 'react';
import classes from './Commenter.module.css';
import PropTypes from 'prop-types';
import AccountInfo from '../../../../UI/AccountInfo/AccountInfo';
import { CloseBtn } from '../../../../UI/Buttons/Buttons';
import { useModalToggle } from '../../../../../utils/customHooks';

const Commenter = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div className={classes.Container} ref={modalRef}>
      <div className={classes.CloseBtn}><CloseBtn close={props.close} /></div>
      <AccountInfo fullName={props.fullName} email={props.email} noBorder />
    </div>
  );
};

Commenter.propTypes = {
  close: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
};

export default Commenter;
