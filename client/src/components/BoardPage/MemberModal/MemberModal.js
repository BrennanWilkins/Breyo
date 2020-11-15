import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classes from './MemberModal.module.css';
import { CloseBtn, BackBtn } from '../../UI/Buttons/Buttons';
import { useModalToggle, useModalPos } from '../../../utils/customHooks';
import { checkIcon } from '../../UI/icons';
import { connect } from 'react-redux';
import { addAdmin, removeAdmin, demoteSelf, setShownMemberActivity } from '../../../store/actions';
import AccountInfo from '../../UI/AccountInfo/AccountInfo';

const MemberModal = props => {
  const [showPermission, setShowPermission] = useState(false);
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  useModalPos(true, modalRef);

  const adminDisabled = !props.userIsAdmin;
  const memberDisabled = !props.userIsAdmin || (props.isAdmin && props.adminCount === 1);

  const changeHandler = mode => {
    if (!props.userIsAdmin) { return; }
    if ((mode === 'admin' && (adminDisabled || props.isAdmin)) ||
    (mode === 'member' && memberDisabled)) { return; }

    if (mode === 'admin' && !props.isAdmin) {
      return props.addAdmin(props.email, props.boardID);
    }
    if (mode === 'member' && props.isAdmin) {
      if (props.email === props.userEmail) { props.demoteSelf(props.boardID); }
      return props.removeAdmin(props.email, props.boardID);
    }
  };

  return (
    <div ref={modalRef} className={classes.Container} style={showPermission ? {width: '350px', height: '270px'} : null}>
      <div className={classes.CloseBtn}><CloseBtn close={props.close} /></div>
      {!showPermission ? <>
      <AccountInfo fullName={props.fullName} email={props.email} />
      <div className={classes.Options} style={{ paddingTop: '15px'}}>
        <div onClick={() => setShowPermission(true)}>Change Permissions ({props.isAdmin ? 'Admin' : 'Member'})</div>
        <div onClick={() => props.setShownMemberActivity({ email: props.email, fullName: props.fullName})}>View Member's Board Activity</div>
      </div>
      </> : <>
      <div className={classes.BackBtn}><BackBtn back={() => setShowPermission(false)} /></div>
      <div className={classes.Title}>Change Permissions</div>
      <div className={classes.Options} style={{ paddingTop: '10px'}}>
        <div onClick={() => changeHandler('admin')} className={adminDisabled ? classes.Disabled : null}>Admin{props.isAdmin && checkIcon}
          <span>Admins can view and edit cards, add and remove members, and change all board settings.</span>
        </div>
        <div onClick={() => changeHandler('member')}
        className={memberDisabled ? classes.Disabled : null}>Member{!props.isAdmin && checkIcon}
          <span>Members can view and edit cards, and change some board settings.</span>
        </div>
      </div>
      {!props.userIsAdmin ?
      <div className={classes.CannotChange}>You must be an admin of this board to change member permissions.</div> :
      props.adminCount === 1 && props.isAdmin ?
      <div className={classes.CannotChange}>{props.userEmail === props.email ? 'You' : 'This member'} can't change roles because there must be at least one admin.</div> :
      null}
      </>}
    </div>
  );
};

MemberModal.propTypes = {
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  adminCount: PropTypes.number.isRequired,
  userEmail: PropTypes.string.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  addAdmin: PropTypes.func.isRequired,
  removeAdmin: PropTypes.func.isRequired,
  boardID: PropTypes.string.isRequired,
  demoteSelf: PropTypes.func.isRequired,
  setShownMemberActivity: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  addAdmin: (email, boardID) => dispatch(addAdmin(email, boardID)),
  removeAdmin: (email, boardID) => dispatch(removeAdmin(email, boardID)),
  demoteSelf: boardID => dispatch(demoteSelf(boardID)),
  setShownMemberActivity: member => dispatch(setShownMemberActivity(member))
});

export default connect(null, mapDispatchToProps)(MemberModal);
