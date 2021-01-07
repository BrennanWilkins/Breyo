import React, { useState } from 'react';
import classes from './TeamMembers.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccountInfo from '../../UI/AccountInfo/AccountInfo';
import { addMemberIcon, dotsIcon } from '../../UI/icons';
import { useDidUpdate } from '../../../utils/customHooks';
import InviteTeamMembers from './InviteTeamMembers/InviteTeamMembers';
import { ActionBtn } from '../../UI/Buttons/Buttons';
import PermissionModal from './PermissionModal/PermissionModal';
import { Input } from '../../UI/Inputs/Inputs';

const TeamMembers = props => {
  const [filter, setFilter] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [shownPermissionModal, setShownPermissionModal] = useState('');

  useDidUpdate(() => {
    setFilteredMembers(props.members.filter(member => member.fullName.includes(filter)));
  }, [filter]);

  const members = filter !== '' ? filteredMembers : props.members;
  const adminCount = props.members.filter(member => member.isAdmin).length;

  return (
    <div className={classes.Container}>
      <div className={classes.MemberMenu}>
        <Input className={classes.FilterInput} placeholder="Filter members by name" value={filter} onChange={e => setFilter(e.target.value)} />
        <button className={classes.InviteBtn} onClick={() => setShowInviteModal(true)}>{addMemberIcon} Invite Team Members</button>
      </div>
      <div className={classes.Members}>
        {members.map(member => (
          <div className={classes.Member} key={member.email}>
            <AccountInfo longerDetails {...member} />
            <div className={classes.MembershipBtn} onClick={() => setShownPermissionModal(member.email)}>
              <ActionBtn>{member.isAdmin ? 'Admin' : 'Member'}{dotsIcon}</ActionBtn>
            </div>
            {shownPermissionModal === member.email &&
              <PermissionModal adminCount={adminCount} email={member.email} isAdmin={member.isAdmin} close={() => setShownPermissionModal('')} />}
          </div>
        ))}
      </div>
      {showInviteModal && <InviteTeamMembers close={() => setShowInviteModal(false)} />}
    </div>
  );
};

TeamMembers.propTypes = {
  members: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  members: state.team.members
});

export default connect(mapStateToProps)(TeamMembers);
