import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classes from './MemberModal.module.css';
import { CloseBtn, BackBtn } from '../../../UI/Buttons/Buttons';
import { useModalToggle, useModalPos } from '../../../../utils/customHooks';
import MemberModalContent from './MemberModalContent';

const MemberModal = props => {
  const [showPermission, setShowPermission] = useState(false);
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  useModalPos(true, modalRef);

  return (
    <div ref={modalRef} className={classes.Container} style={showPermission ? {width: '350px', height: '270px'} : null}>
      <CloseBtn className={classes.CloseBtn} close={props.close} />
      {showPermission &&
        <>
          <div className={classes.BackBtn}><BackBtn back={() => setShowPermission(false)} /></div>
          <div className={classes.Title}>Change Permissions</div>
        </>
      }
      <MemberModalContent fullName={props.fullName} email={props.email} isAdmin={props.isAdmin}
      adminCount={props.adminCount} avatar={props.avatar} showPermission={showPermission} setShowPermission={() => setShowPermission(true)} />
    </div>
  );
};

MemberModal.propTypes = {
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  adminCount: PropTypes.number.isRequired,
  avatar: PropTypes.string
};

export default MemberModal;
