import React, { useState, useRef } from 'react';
import classes from './InviteTeamMembers.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';
import { inviteTeamMembers } from '../../../../store/actions';
import { connect } from 'react-redux';

const InviteTeamMembers = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [membersInput, setMembersInput] = useState('');

  const inviteHandler = () => {
    if (!membersInput.length) { return; }
    props.sendInvite(membersInput);
    props.close();
  };

  return (
    <div ref={modalRef} className={classes.Container}>
      <ModalTitle title="Invite team members" close={props.close} />
      <p>To invite multiple users, separate each email by a single space.</p>
      <input className={classes.Input} value={membersInput} onChange={e => setMembersInput(e.target.value)} />
      <button className={classes.InviteBtn} onClick={inviteHandler}>Invite to team</button>
    </div>
  );
};

InviteTeamMembers.propTypes = {
  close: PropTypes.func.isRequired,
  sendInvite: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  sendInvite: members => dispatch(inviteTeamMembers(members))
});

export default connect(null, mapDispatchToProps)(InviteTeamMembers);
