import React, { useState } from 'react';
import classes from './TeamMembers.module.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addMemberIcon } from '../../UI/icons';
import { useDidUpdate } from '../../../utils/customHooks';
import InviteTeamMembers from './InviteTeamMembers/InviteTeamMembers';
import { Input } from '../../UI/Inputs/Inputs';
import TeamMemberList from './TeamMemberList';

const TeamMembers = props => {
  const [filter, setFilter] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useDidUpdate(() => {
    if (filter) { setFilteredMembers(props.members.filter(member => member.fullName.toLowerCase().includes(filter.toLowerCase()))); }
  }, [filter]);

  const members = filter ? filteredMembers : props.members;
  const adminCount = props.members.filter(member => member.isAdmin).length;

  return (
    <div className={classes.Container}>
      <div className={classes.MemberMenu}>
        <Input className={classes.FilterInput} placeholder="Filter members by name" value={filter} onChange={e => setFilter(e.target.value)} />
        <button className={classes.InviteBtn} onClick={() => setShowInviteModal(true)}>{addMemberIcon} Invite Team Members</button>
      </div>
      <TeamMemberList members={members} adminCount={adminCount} />
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
