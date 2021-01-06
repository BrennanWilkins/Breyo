import React, { useState, useRef } from 'react';
import classes from './InviteTeamMembers.module.css';
import { useModalToggle } from '../../../../utils/customHooks';
import PropTypes from 'prop-types';
import ModalTitle from '../../../UI/ModalTitle/ModalTitle';
import { inviteTeamMembers } from '../../../../store/actions';
import { connect } from 'react-redux';
import { EmailChipInput } from '../../../UI/Inputs/Inputs';

const InviteTeamMembers = props => {
  const modalRef = useRef();
  useModalToggle(true, modalRef, props.close);
  const [emails, setEmails] = useState([]);

  const inviteHandler = () => {
    if (!emails.length) { return; }
    props.sendInvite(emails);
    props.close();
  };

  return (
    <div ref={modalRef} className={classes.Container}>
      <ModalTitle title="Invite team members" close={props.close} />
      <p>To invite multiple users, type or paste emails below and press enter.</p>
      <div className={classes.EmailChipInput}>
        <EmailChipInput emails={emails} setEmails={arr => setEmails(arr)} />
      </div>
      <button className={classes.InviteBtn} onClick={inviteHandler}>Invite to team</button>
    </div>
  );
};

InviteTeamMembers.propTypes = {
  close: PropTypes.func.isRequired,
  sendInvite: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  sendInvite: emails => dispatch(inviteTeamMembers(emails))
});

export default connect(null, mapDispatchToProps)(InviteTeamMembers);
