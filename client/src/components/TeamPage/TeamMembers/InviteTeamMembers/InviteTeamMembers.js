import React, { useState } from 'react';
import classes from './InviteTeamMembers.module.css';
import PropTypes from 'prop-types';
import { inviteTeamMembers } from '../../../../store/actions';
import { connect } from 'react-redux';
import { EmailChipInput } from '../../../UI/Inputs/Inputs';
import ModalContainer from '../../../UI/ModalContainer/ModalContainer';
import { ActionBtn } from '../../../UI/Buttons/Buttons';

const InviteTeamMembers = props => {
  const [emails, setEmails] = useState([]);

  const inviteHandler = () => {
    if (!emails.length) { return; }
    props.sendInvite(emails);
    props.close();
  };

  return (
    <ModalContainer className={classes.Container} title="Invite team members" close={props.close} addMargin>
      <p>To invite multiple users, type or paste emails below and press enter.</p>
      <div className={classes.EmailChipInput}>
        <EmailChipInput emails={emails} setEmails={arr => setEmails(arr)} />
      </div>
      <ActionBtn className={classes.InviteBtn} onClick={inviteHandler}>Invite to team</ActionBtn>
    </ModalContainer>
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
