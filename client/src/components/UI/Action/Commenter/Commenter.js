import React, { useRef } from 'react';
import classes from './Commenter.module.css';
import PropTypes from 'prop-types';
import AccountInfo from '../../AccountInfo/AccountInfo';
import { CloseBtn } from '../../Buttons/Buttons';
import { useModalToggle } from '../../../../utils/customHooks';

const Commenter = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  return (
    <div className={classes.Container} ref={modalRef}>
      <CloseBtn className={classes.CloseBtn} close={props.close} />
      <AccountInfo fullName={props.fullName} email={props.email} noBorder avatar={props.avatar} />
    </div>
  );
};

Commenter.propTypes = {
  close: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string
};

export default Commenter;
