import React from 'react';
import classes from './MemberModal.module.css';
import { checkIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import { addAdmin, removeAdmin, demoteSelf, setShownMemberActivity } from '../../../../store/actions';
import AccountInfo from '../../../UI/AccountInfo/AccountInfo';
import PropTypes from 'prop-types';

const MemberModalContent = props => {
  const adminDisabled = !props.userIsAdmin;
  const memberDisabled = !props.userIsAdmin || (props.isAdmin && props.adminCount === 1);

  const changeHandler = mode => {
    // cant change permissions if not admin
    if (!props.userIsAdmin) { return; }
    // cant change permissions if user already admin or not enough admins to change to member
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
    !props.showPermission ?
    <>
      <AccountInfo fullName={props.fullName} email={props.email} avatar={props.avatar} />
      <div className={classes.Options} style={{ paddingTop: '15px'}}>
        <div onClick={props.setShowPermission}>Change Permissions ({props.isAdmin ? 'Admin' : 'Member'})</div>
        <div onClick={() => props.setShownMemberActivity({ email: props.email, fullName: props.fullName})}>View Member's Board Activity</div>
      </div>
    </>
    :
    <>
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
        <div className={classes.CannotChange}>You must be an admin of this board to change member permissions.</div>
        : props.adminCount === 1 && props.isAdmin ?
        <div className={classes.CannotChange}>{props.userEmail === props.email ? 'You' : 'This member'} can't change roles because there must be at least one admin.</div>
        : null
      }
    </>
  );
};

MemberModalContent.propTypes = {
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  adminCount: PropTypes.number.isRequired,
  userEmail: PropTypes.string.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  addAdmin: PropTypes.func.isRequired,
  removeAdmin: PropTypes.func.isRequired,
  boardID: PropTypes.string.isRequired,
  demoteSelf: PropTypes.func.isRequired,
  setShownMemberActivity: PropTypes.func.isRequired,
  avatar: PropTypes.string,
  showPermission: PropTypes.bool.isRequired,
  setShowPermission: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userEmail: state.user.email,
  userIsAdmin: state.board.userIsAdmin,
  boardID: state.board.boardID
});

const mapDispatchToProps = dispatch => ({
  addAdmin: (email, boardID) => dispatch(addAdmin(email, boardID)),
  removeAdmin: (email, boardID) => dispatch(removeAdmin(email, boardID)),
  demoteSelf: boardID => dispatch(demoteSelf(boardID)),
  setShownMemberActivity: member => dispatch(setShownMemberActivity(member))
});

export default connect(mapStateToProps, mapDispatchToProps)(MemberModalContent);
