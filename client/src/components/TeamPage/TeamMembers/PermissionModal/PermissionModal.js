import React, { useRef } from 'react';
import classes from './PermissionModal.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';
import { checkIcon } from '../../../UI/icons';
import { connect } from 'react-redux';
import { promoteTeamMember, demoteTeamMember } from '../../../../store/actions';

const PermissionModal = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);

  const changeHandler = changeToAdmin => {
    if (changeToAdmin) { props.promoteTeamMember(props.email); }
    else { props.demoteTeamMember(props.email); }
  };

  const isUser = props.email === props.userEmail;
  const oneAdmin = props.adminCount === 1;
  // cannot change team member to admin if already admin or if user is not admin
  const adminDisabled = props.isAdmin || !props.userIsAdmin;
  // cannot change team member to member if already member or user is only admin or
  // if user is not an admin
  const memberDisabled = !props.isAdmin || (props.isAdmin && oneAdmin) || !props.userIsAdmin;

  return (
    <div ref={modalRef} className={classes.Container}>
      <ModalTitle close={props.close} title="Change Permissions" />
      <div className={classes.Options}>
        <div onClick={() => changeHandler(true)} className={adminDisabled ? classes.Disabled : null}>
          Admin{props.isAdmin && checkIcon}
          <span>Admins can create and edit team boards, add or remove other team admins, and change team settings.</span>
        </div>
        <div onClick={() => changeHandler(false)} className={memberDisabled ? classes.Disabled : null}>
          Member{!props.isAdmin && checkIcon}
          <span>Admins can create and edit team boards, but not add other admins or change settings.</span>
        </div>
      </div>
      {!props.userIsAdmin && <div className={classes.CannotChange}>You must be an admin to change member permissions.</div>}
      {(isUser && props.userIsAdmin && oneAdmin) && <div className={classes.CannotChange}>You cannot change roles if you are the only admin.</div>}
    </div>
  );
};

PermissionModal.propTypes = {
  email: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  adminCount: PropTypes.number.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  userEmail: PropTypes.string.isRequired,
  promoteTeamMember: PropTypes.func.isRequired,
  demoteTeamMember: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userIsAdmin: state.team.userIsAdmin,
  userEmail: state.user.email
});

const mapDispatchToProps = dispatch => ({
  promoteTeamMember: email => dispatch(promoteTeamMember(email)),
  demoteTeamMember: email => dispatch(demoteTeamMember(email))
});

export default connect(mapStateToProps, mapDispatchToProps)(PermissionModal);
