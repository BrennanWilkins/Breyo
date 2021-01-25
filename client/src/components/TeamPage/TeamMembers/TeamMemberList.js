import React, { useState } from 'react';
import classes from './TeamMembers.module.css';
import PropTypes from 'prop-types';
import { ActionBtn } from '../../UI/Buttons/Buttons';
import PermissionModal from './PermissionModal/PermissionModal';
import AccountInfo from '../../UI/AccountInfo/AccountInfo';
import { dotsIcon } from '../../UI/icons';

const TeamMemberList = props => {
  const [shownPermissionModal, setShownPermissionModal] = useState('');

  return (
    <div className={classes.Members}>
      {props.members.map(member => (
        <div className={classes.Member} key={member.email}>
          <AccountInfo longerDetails {...member} />
          <ActionBtn className={classes.MembershipBtn} clicked={() => setShownPermissionModal(member.email)}>
            {member.isAdmin ? 'Admin' : 'Member'}{dotsIcon}
          </ActionBtn>
          {shownPermissionModal === member.email &&
            <PermissionModal adminCount={props.adminCount} email={member.email} isAdmin={member.isAdmin} close={() => setShownPermissionModal('')} />}
        </div>
      ))}
    </div>
  );
};

TeamMemberList.propTypes = {
  members: PropTypes.array.isRequired,
  adminCount: PropTypes.number.isRequired
};

export default React.memo(TeamMemberList);
